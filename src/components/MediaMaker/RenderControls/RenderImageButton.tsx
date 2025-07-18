import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';

import MonthlyMediaFileCounter from './MonthlyMediaFileCounter';

import Button from '@/dls/Button/Button';
import { RenderStatus, useGenerateMediaFile } from '@/hooks/auth/media/useGenerateMediaFile';
import useGetMediaFilesCount from '@/hooks/auth/media/useGetMediaFilesCount';
import IconDownload from '@/icons/download.svg';
import { MediaType } from '@/types/Media/GenerateMediaFileRequest';
import MediaRenderError from '@/types/Media/MediaRenderError';
import { isLoggedIn } from '@/utils/auth/login';
import { logButtonClick } from '@/utils/eventLogger';
import { mutateGeneratedMediaCounter } from '@/utils/media/utils';
import { getLoginNavigationUrl, getQuranMediaMakerNavigationUrl } from '@/utils/navigation';

type Props = {
  inputProps: any;
  getCurrentFrame: () => void;
  isFetching: boolean;
};

// TODO: create a common component with RenderVideoButton since most of the component contains the same code.
const RenderImageButton: React.FC<Props> = ({ inputProps, getCurrentFrame, isFetching }) => {
  const { t } = useTranslation('quran-media-maker');
  const { renderMedia, state } = useGenerateMediaFile(inputProps);
  const { data, mutate } = useGetMediaFilesCount(MediaType.IMAGE);
  const [isLimitExceeded, setIsLimitExceeded] = useState(false);

  const router = useRouter();
  const downloadButtonRef = React.useRef<HTMLParagraphElement>();

  const onRenderClicked = () => {
    logButtonClick('render_image');
    if (isLoggedIn()) {
      renderMedia(MediaType.IMAGE, { frame: getCurrentFrame() });
    } else {
      router.replace(getLoginNavigationUrl(getQuranMediaMakerNavigationUrl()));
    }
  };

  const onDownloadClicked = () => {
    logButtonClick('download_image');
  };

  const isInitOrInvokingOrError = [
    RenderStatus.INIT,
    RenderStatus.INVOKING,
    RenderStatus.ERROR,
  ].includes(state.status);

  const isRenderingOrDone = [RenderStatus.RENDERING, RenderStatus.DONE].includes(state.status);

  // listen to state changes and download the file when it's done
  useEffect(() => {
    if (state?.status === RenderStatus.DONE) {
      mutate(mutateGeneratedMediaCounter, { revalidate: false });
      // download the file by clicking the download button
      downloadButtonRef.current.click();
    }

    if (
      state?.status === RenderStatus.ERROR &&
      state?.errorDetails?.code === MediaRenderError.MediaFilesPerUserLimitExceeded
    ) {
      setIsLimitExceeded(true);
    }
  }, [mutate, state]);

  const isRendering = state.status === RenderStatus.RENDERING;
  return (
    <div>
      <div>
        {isInitOrInvokingOrError && (
          <>
            <Button
              isDisabled={isFetching || state.status === RenderStatus.INVOKING}
              isLoading={isFetching || state.status === RenderStatus.INVOKING}
              onClick={onRenderClicked}
            >
              {t('download-image')}
            </Button>
            {state.status === RenderStatus.ERROR && !isLimitExceeded && (
              <div>
                {state?.errorDetails?.code === MediaRenderError.MediaVersesRangeLimitExceeded
                  ? state?.error?.message
                  : t('common:error.general')}
              </div>
            )}
          </>
        )}
        {isRenderingOrDone && (
          <>
            <Button
              prefix={<IconDownload />}
              isDisabled={isFetching || isRendering}
              isLoading={isFetching || isRendering}
              href={state.status === RenderStatus.DONE ? state.url : ''}
              onClick={onDownloadClicked}
            >
              <p ref={downloadButtonRef}>{t('download-image')}</p>
            </Button>
          </>
        )}
      </div>
      <MonthlyMediaFileCounter isLimitExceeded={isLimitExceeded} data={data?.data} />
    </div>
  );
};

export default RenderImageButton;
