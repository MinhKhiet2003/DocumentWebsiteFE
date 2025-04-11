import CommonResource from '../../../components/CommonResource/CommonResource';

const Videos = () => {
  return (
    <CommonResource
      resourceType="experiment-videos"
      apiEndpoint="https://hachieve.runasp.net/api/Video/search"
      title="Videos"
      itemsPerPage={6}
      imageField="thumbnailUrl"
    />
  );
};

export default Videos;