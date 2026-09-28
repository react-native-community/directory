type NestedStringOrObject = string | { [key: string]: NestedStringOrObject };

type Props = {
  data: Record<string, NestedStringOrObject>;
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
