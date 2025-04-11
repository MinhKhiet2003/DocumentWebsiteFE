import CommonResource from '../../../components/CommonResource/CommonResource';

const LessonPlans = () => {
  return (
    <CommonResource
      resourceType="lesson-plans"
      apiEndpoint="https://hachieve.runasp.net/api/Document/search"
      title="Kế hoạch bài dạy"
    />
  );
};

export default LessonPlans;