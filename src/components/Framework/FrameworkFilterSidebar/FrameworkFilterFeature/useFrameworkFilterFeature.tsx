// Libraries
import { useEffect, useState } from "react"
import { useTranslation } from "next-i18next"
import { Icon } from "@chakra-ui/react"

import { useFrameworkTable } from "../../FrameworkTable/useFrameworkTable"

import { FrameworkFilterFeatureProps } from "."

type FilterOptionType = {
  title: string
  items: Array<{
    title: string
    icon: typeof Icon
    description: string
    filterKey: string | undefined
    showOptions: boolean | undefined
    options:
      | Array<{
          name: string
          filterKey?: string
          inputType: "checkbox"
        }>
      | []
  }>
}

export const useFrameworkFilterFeature = ({
  resetFrameworkFilter,
  filters,
  updateFilterOptions,
}: Omit<FrameworkFilterFeatureProps, "updateFilterOption">) => {
  const { t } = useTranslation("page-find-wallet")
  const frameworkData = []
  const { featureDropdownItems, perspectiveDropdownItems } = useFrameworkTable({ filters, t, frameworkData })
  const [filterOptions, setFilterOptions] = useState<FilterOptionType[]>([perspectiveDropdownItems[2]].map((perspectiveItem) => ({
    title: perspectiveItem.label,
    items: featureDropdownItems
      .filter((featureItem) => featureItem.category === perspectiveItem.category)
      .map((filteredFeatureItem) => ({
        title: t(filteredFeatureItem.label),
        icon: filteredFeatureItem.icon,
        description: filteredFeatureItem.description,
        filterKey: filteredFeatureItem.filterKey,
        showOptions: undefined,
        options: [],
      })),
  })))

  const setShowOptions = (idx, itemidx, value) => {
    const updatedFilterOptions = [...filterOptions]
    updatedFilterOptions[idx].items[itemidx].showOptions =
      !updatedFilterOptions[idx].items[itemidx].showOptions
    setFilterOptions(updatedFilterOptions)

    const keys = updatedFilterOptions[idx].items[itemidx].options.map(
      (item) => item.filterKey
    )
    updateFilterOptions(keys, value)
  }

  useEffect(() => {
    const resetFilters = () => {
      for (let filterItem of filterOptions) {
        for (let item of filterItem.items) {
          if (item.options.length > 0) {
            item.showOptions = false
          } else {
            item.showOptions = undefined
          }
        }
      }
    }
    resetFrameworkFilter.current = resetFilters
  }, [filterOptions, resetFrameworkFilter])

  return {
    setShowOptions,
    filterOptions,
  }
}
