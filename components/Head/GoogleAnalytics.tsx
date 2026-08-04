import Script from 'next/script';

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
      <Script async src={`https://www.googletagmanager.com/gtag/js?id=${id}`} />
      <Script id={id} dangerouslySetInnerHTML={{ __html: getAnalyticsScript(id) }} />
    </>
  );
}
