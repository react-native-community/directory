import { P } from '~/common/styleguide';
import { Button } from '~/components/Button';
import ContentContainer from '~/components/ContentContainer';
import Navigation from '~/components/Navigation';
import NotFoundContent from '~/components/NotFoundContent';
import PageMeta from '~/components/PageMeta';
import tw from '~/util/tailwind';

export default function NotFound() {
  return (
    <>
      <PageMeta title="Error" description="Nothing was found! Go back to the directory home." />
      <Navigation header={<></>} />
      <ContentContainer>
        <NotFoundContent
          header="Nothing was found! Go back to the directory home."
          alt="No package"
          bottomSlot={
            <Button href="/" style={tw`my-5 px-4 py-1.5`}>
              <P style={tw`ml-1 text-white`}>Go back Home</P>
            </Button>
          }
        />
      </ContentContainer>
    </>
  );
}
