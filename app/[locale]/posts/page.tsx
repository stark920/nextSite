import { getSortedPostsData } from '@/app/lib/posts'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useTranslation } from '@/app/i18n'

export default async function Posts({ params }: { params: { locale: string } }) {
  const { locale } = await params
  const { t } = await useTranslation(locale)
  const allPostsData = getSortedPostsData('vue')

  return (
    <section>
      <h2>{t('vue')}</h2>
      <div>
        {allPostsData.map(({ id, date, title }) => (
          <Card key={id}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{date}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>123</p>
            </CardContent>
            <CardFooter>
              <p>12345</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
