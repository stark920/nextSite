import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { FaYoutube, FaPodcast } from 'react-icons/fa'
import { getI18nText } from '@/app/i18n'
import type { Metadata } from 'next'

const youtubeResources = [
  {
    name: 'Monster Training HQ',
    link: 'https://www.youtube.com/@monstertraining',
    description:
      '失眠族的救星（？，怪獸訓練主要在觀念的分享，健身先健心，良好的心理素質能走的長久，良好的訓練觀念能走的安穩。',
  },
  {
    name: 'NewBe Weightlifting',
    link: 'https://www.youtube.com/@nbweightlifting',
    description:
      '舉重為主的教學頻道，就算看過各種訓練教學的影片，來看羅教的影片也能感受到他的滿滿乾貨，真的是超級厲害的教練。',
  },
  {
    name: '卓叔增重',
    link: 'https://www.youtube.com/@UncleZhuo',
    description:
      '主打瘦子增重的教學頻道，近期較少更新，也許是因為此題材已經拍到極限，但對於想變壯的瘦子族群仍是非常有用的頻道。',
  },
  {
    name: '白天手術房晚上健身房',
    link: 'https://www.youtube.com/@musclenet2003',
    description:
      '從「有在訓練的醫生」視角分析探討各種重訓相關議題（陳醫師是 2023 亞錦賽裝備臥推金牌），醫師的過人之處就是能看懂各種醫學期刊、研究，並盡可能的用一般人聽的懂得方式解說。',
  },
  {
    name: '北美运动学博士Bruce_PhD',
    link: 'https://www.youtube.com/@bruce_lu_1993',
    description: '分享各種研究論文和訓練經驗，經常一語中的，說出許多人訓練的錯誤之處。',
  },
]

const podcastResources = [
  {
    name: '怪獸訓練電台',
    link: 'https://podcasts.apple.com/tw/podcast/%E6%80%AA%E7%8D%B8%E8%A8%93%E7%B7%B4%E9%9B%BB%E5%8F%B0/id1591730336',
    description: '探討個年齡層、不同族群在肌力體能訓練上的各種議題。',
  },
  {
    name: '邱個 Podcast',
    link: 'https://podcasts.apple.com/tw/podcast/%E9%82%B1%E5%80%8B-podcast/id1523955987',
    description: '訓練、運動有關什麼都談。',
  },
  {
    name: '我很(賤)健談',
    link: 'https://podcasts.apple.com/tw/podcast/%E6%88%91%E5%BE%88-%E8%B3%A4-%E5%81%A5%E8%AB%87/id1763383210',
    description: '討論健力為主，會找一些國手訪談，內容多以輕鬆聊天為主。',
  },
]

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `健身推薦資源 - ${process.env.NEXT_PUBLIC_SITE_TITLE}`,
    description: '各種健身相關的 Youtube, Podcast 推薦資源',
    category: '健身',
  }
}

export default async function Suggest({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const { t } = await getI18nText(locale)

  return (
    <article className='prose prose-zinc max-w-full dark:prose-invert'>
      <h1>{t('recommendedResources')}</h1>
      <Accordion type='multiple' defaultValue={['youtube', 'podcast']}>
        <AccordionItem value='youtube'>
          <AccordionTrigger>
            <h2 className='m-0 flex items-center gap-2'>
              <div className='rounded-sm bg-white p-1'>
                <FaYoutube className='size-4 text-red-500' />
              </div>
              Youtube
            </h2>
          </AccordionTrigger>
          <AccordionContent>
            <ul className='space-y-6 text-base'>
              {youtubeResources.map(({ name, link, description }) => (
                <li key={name} className='flex flex-col gap-1'>
                  <a href={link} target='_blank' rel='noopener noreferrer nofollow'>
                    {name}
                  </a>
                  <span>{description}</span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='podcast'>
          <AccordionTrigger>
            <h2 className='m-0 flex items-center gap-2'>
              <div className='rounded-sm bg-purple-600 p-1'>
                <FaPodcast className='text-whit size-4' />
              </div>
              Podcast
            </h2>
          </AccordionTrigger>
          <AccordionContent>
            <ul className='space-y-6 text-base'>
              {podcastResources.map(({ name, link, description }) => (
                <li key={name} className='flex flex-col gap-1'>
                  <a href={link} target='_blank' rel='noopener noreferrer nofollow'>
                    {name}
                  </a>
                  <span>{description}</span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </article>
  )
}
