import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';

import styles from './Footer.module.scss';

import Link, { LinkVariant } from '@/dls/Link/Link';
import QuranTextLogo from '@/icons/logo-tsirwah.svg';
import { logButtonClick } from '@/utils/eventLogger';

const TitleAndDescription = () => {

  return (
    <div className={styles.titleAndDescriptionContainer}>
      <div className={styles.headingContainer}>
        <div className={styles.iconContainer}>
          <QuranTextLogo />
        </div>
      </div>
    </div>
  );
};

export default TitleAndDescription;
