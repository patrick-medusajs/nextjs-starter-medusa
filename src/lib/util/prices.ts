import {
  MoneyAmount,
  ProductVariant,
  Region,
  SetRelation,
} from "@medusajs/client-types"
import { formatAmount } from "medusa-react"

type ProductVariantWithPrices = SetRelation<ProductVariant, "prices">

export const findCheapestRegionPrice = (
  variants: ProductVariantWithPrices[],
  regionId: string
) => {
  const regionPrices = variants.reduce((acc, v) => {
    const price = v.prices.find((p) => p.region_id === regionId)
    if (price) {
      acc.push(price)
    }

    return acc
  }, [] as MoneyAmount[])

  if (!regionPrices.length) {
    return undefined
  }

  //find the price with the lowest amount in regionPrices
  const cheapestPrice = regionPrices.reduce((acc, p) => {
    if (acc.amount > p.amount) {
      return p
    }

    return acc
  })

  return cheapestPrice
}

export const findCheapestCurrencyPrice = (
  variants: ProductVariantWithPrices[],
  currencyCode: string
) => {
  const currencyPrices = variants.reduce((acc, v) => {
    const price = v.prices.find((p) => p.currency_code === currencyCode)
    if (price) {
      acc.push(price)
    }

    return acc
  }, [] as MoneyAmount[])

  if (!currencyPrices.length) {
    return undefined
  }

  //find the price with the lowest amount in currencyPrices
  const cheapestPrice = currencyPrices.reduce((acc, p) => {
    if (acc.amount > p.amount) {
      return p
    }

    return acc
  })

  return cheapestPrice
}

export const findCheapestPrice = (
  variants: ProductVariantWithPrices[],
  region: Region
) => {
  const { id, currency_code } = region

  let cheapestPrice = findCheapestRegionPrice(variants, id)

  if (!cheapestPrice) {
    cheapestPrice = findCheapestCurrencyPrice(variants, currency_code)
  }

  if (cheapestPrice) {
    return formatAmount({
      amount: cheapestPrice.amount,
      region: region,
    })
  }

  // if we can't find any price that matches the current region,
  // either by id or currency, then the product is not available in
  // the current region
  return "Not available in your region"
}
