import { Lang } from "@/lib/types"

import { Program, Skill } from "@/components/TutorialMetadata"

import { IExternalTutorial, ITutorial } from "@/pages/developers/tutorials"

// Take all tutorials, and return a list of tutorials for a specific locale
export const filterTutorialsByLang = (
  internalTutorials: any,
  externalTutorials: Array<IExternalTutorial>,
  locale: Lang
): Array<ITutorial> => {
  const internalTutorialsMap = internalTutorials.map((tutorial) => {
    const lang = tutorial?.lang || "en"

    return {
      to: tutorial.to || "",
      title: tutorial?.title || "",
      description: tutorial?.description || "",
      author: tutorial?.author || "",
      tags: tutorial?.tags?.map((tag) => (tag || "").toLowerCase().trim()),
      programType: tutorial?.programType,
      skillLevel: tutorial?.skillLevel as Skill,
      timeToRead: tutorial?.timeToRead,
      published: tutorial?.published,
      lang: tutorial?.lang,
      isExternal: false,
    }
  })

  const externalTutorialsMap = externalTutorials.map<ITutorial>(
    (tutorial: IExternalTutorial) => ({
      to: tutorial.url,
      title: tutorial.title,
      description: tutorial.description,
      author: tutorial.author,
      tags: tutorial.tags.map((tag) => tag.toLowerCase().trim()),
      programType: tutorial.programType,
      skillLevel: tutorial.skillLevel as Skill,
      timeToRead: Number(tutorial.timeToRead),
      published: new Date(tutorial.publishDate).toISOString(),
      lang: tutorial.lang || "en",
      isExternal: true,
    })
  )

  const allTutorials: Array<ITutorial> = [
    ...externalTutorialsMap,
    ...internalTutorialsMap,
  ]

  const filteredTutorials = allTutorials
    .filter((tutorial) => tutorial.lang === locale)
    .sort((a, b) => {
      if (a.published && b.published) {
        return new Date(b.published).getTime() - new Date(a.published).getTime()
      }
      // Dont order if no published is present
      return 0
    })

  return filteredTutorials
}

export const getSortedTutorialTagsForLang = (
  filteredTutorialsByLang: Array<ITutorial> = []
) => {
  const allTags = filteredTutorialsByLang.reduce<Array<string>>(
    (tags, tutorial) => {
      return [...tags, ...(tutorial.tags || [])]
    },
    []
  )

  const reducedTags = allTags.reduce((acc, tag) => {
    if (acc[tag]) {
      acc[tag] = acc[tag] + 1
    } else {
      acc[tag] = 1
    }
    return acc
  }, {})

  const sortedTags = Object.keys(reducedTags)
    .sort()
    .reduce((obj, key) => {
      obj[key] = reducedTags[key]
      return obj
    }, {})

  return sortedTags
}
