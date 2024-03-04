import type { GetStaticProps, InferGetStaticPropsType } from "next"
import { useRouter } from "next/router"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { FaBook, FaDiscord, FaGithub, FaHome, FaInstagram, FaTiktok, FaToolbox, FaTwitter, FaYoutube } from "react-icons/fa"
import {
    useToken,
} from "@chakra-ui/react"

import { BasePageProps, Lang } from "@/lib/types"

import { existsNamespace } from "@/lib/utils/existsNamespace"
import { getLastDeployDate } from "@/lib/utils/getLastDeployDate"
import {
    getRequiredNamespacesForPage,
    isLangRightToLeft,
} from "@/lib/utils/translations"

import community_gathering from "@/public/community_gathering.png"
import understand_yourself from "@/public/understand_yourself.png"
import LinksPage from "@/components/Links"

type Props = BasePageProps & {
}

export const getStaticProps = (async ({ locale }) => {

    // load i18n required namespaces for the given page
    const requiredNamespaces = getRequiredNamespacesForPage("/links")

    // check if the translated page content file exists for locale
    const contentNotTranslated = !existsNamespace(locale!, requiredNamespaces[0])

    // load last deploy date to pass to Footer in RootLayout
    const lastDeployDate = getLastDeployDate()

    return {
        props: {
            ...(await serverSideTranslations(locale!, requiredNamespaces)),
            contentNotTranslated,
            lastDeployDate,
        },
        // revalidate: BASE_TIME_UNIT * 24,
    }
}) satisfies GetStaticProps<Props>

const HomePage = ({
}: InferGetStaticPropsType<typeof getStaticProps>) => {
    const { t } = useTranslation(["common", "page-links"])
    const { locale } = useRouter()
    const dir = isLangRightToLeft(locale as Lang) ? "rtl" : "ltr"

    const headerData = {
        title: t("common:site-title"),
        description: t("common:site-description"),
        imageSrc: community_gathering,
        imageAlt: "",
        buttonLabel: t("common:learn-more"),
        buttonTo: "https://the.x3.family",
        connectTitle: t("page-links:page-links-connect-title")
    }

    const cardBoxShadow = useToken("colors", "cardBoxShadow")

    const cardsData = [
        {
            image: understand_yourself,
            icon: FaBook,
            title: "Understand Yourself With The Better Life Framework",
            to: "/understand-yourself/",
            boxShadow: cardBoxShadow
        },
        {
            image: understand_yourself,
            icon: FaToolbox,
            title: "Unlock Your Potential With Personalized Programs",
            to: "/unlock-your-potential/",
            boxShadow: cardBoxShadow
        },
        {
            image: understand_yourself,
            icon: FaHome,
            title: "Live With Us @ Our Family Without Borders",
            to: "https://ourfamilywithoutborders.com",
            boxShadow: cardBoxShadow
        },
    ]
    
    const socialLinksData = [
        {
            icon: FaDiscord,
            to: "https://our.x3.family/",
            ariaLabel: "Community",
            color: "#7289da",
            title: "Join The Community"
        },
        {
            icon: FaYoutube,
            to: "https://www.youtube.com/c/thex3family",
            ariaLabel: "YouTube",
            color: "#FF0000",
            title: "Watch Our Content"
        },
        {
            icon: FaInstagram,
            to: "https://www.instagram.com/thex3family",
            ariaLabel: "Instagram",
            color: "#833AB4",
            title: "A Day In Our Life"
        },
        {
            icon: FaTiktok,
            to: "https://www.tiktok.com/@thex3family",
            ariaLabel: "TikTok",
            color: "#00f2ea",
            title: "Get Quick Learnings"
        },
        {
            icon: FaGithub,
            to: "https://github.com/thex3family",
            ariaLabel: "GitHub",
            color: "#2b3137",
            title: "Build With Us"
        },
        {
            icon: FaTwitter,
            to: "https://twitter.com/thex3family",
            ariaLabel: "Twitter",
            color: "#1DA1F2",
            title: "Tweet At Us"
        },
    ]


    return (
        <LinksPage headerData={headerData} cardsData={cardsData} socialLinksData={socialLinksData} dir={dir} />
    )
}

export default HomePage