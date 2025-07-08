import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import styles from './Footer.module.scss';

import Link, { LinkVariant } from '@/dls/Link/Link';
import QuranTextLogo from '@/icons/logo-tsirwah.svg';
import { logButtonClick } from '@/utils/eventLogger';

const TitleAndDescription = () => {
  const { t } = useTranslation('common');



export default TitleAndDescription;
