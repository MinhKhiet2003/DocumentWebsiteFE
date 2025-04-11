import CommonResource from '../../../components/CommonResource/CommonResource';

const Videos = () => {
  return (
    <CommonResource
      resourceType="experiment-videos"
      apiEndpoint="https://hachieve.runasp.net/api/Video/search"
      title="Videos"
      itemsPerPage={6}
      imageField="thumbnailUrl"
      dateField="created_at"
    />
  );
};

export default Videos;