function getAnalyticsScript(id: string) {
  return `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');
`.replace(/\n/g, '');
}

type Props = {
  id: string;
};

export default function GoogleAnalytics({ id }: Props) {
  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${id}`} />
      <script dangerouslySetInnerHTML={{ __html: getAnalyticsScript(id) }} />
    </>
  );
}
