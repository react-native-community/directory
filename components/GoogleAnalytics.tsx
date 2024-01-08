const getAnalyticsScript = (id: string) => {
  return `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');
`.replace(/\n/g, '');
};

const GoogleAnalytics = ({ id }) => (
  <>
    <script async src={`https://www.googletagmanager.com/gtag/js?id=${id}`} />
    <script dangerouslySetInnerHTML={{ __html: getAnalyticsScript(id) }} />
  </>
);

export default GoogleAnalytics;
