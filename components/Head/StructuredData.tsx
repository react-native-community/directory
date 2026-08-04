type Props = {
  data: Record<string, any>;
};

export default function StructuredData({ data }: Props) {
  return (
    <script
      key="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
