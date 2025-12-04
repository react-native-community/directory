import { StyleSheet } from 'react-native';

import { Button } from '~/components/Button';
import ContentContainer from '~/components/ContentContainer';
import Navigation from '~/components/Navigation';
import NotFoundContent from '~/components/NotFoundContent';

export default function NotFound() {
  return (
    <>
      <Navigation />
      <ContentContainer>
        <NotFoundContent
          header="Nothing was found! Go back to the directory home."
          alt="No package"
          bottomSlot={
            <Button href="/" style={styles.homeButton}>
              Go back Home
            </Button>
          }
        />
      </ContentContainer>
    </>
  );
}

const styles = StyleSheet.create({
  homeButton: {
    color: 'inherit',
    marginVertical: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});
