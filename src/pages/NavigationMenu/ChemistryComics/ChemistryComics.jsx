import CommonResource from '../../../components/CommonResource/CommonResource';

const ChemistryComics = () => {
  return (
    <CommonResource
      resourceType="chemistry-comics"
      apiEndpoint="https://hachieve.runasp.net/api/Comic/search"
      title="Chemistry Comics"
      titleField="title"
      descriptionField="description"
      authorField="username"
    />
  );
};

export default ChemistryComics;