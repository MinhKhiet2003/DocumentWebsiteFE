import CommonResource from '../../../components/CommonResource/CommonResource';
import "./games.css"; 
const Games = () => {
  return (
    <CommonResource
      resourceType="games"
      apiEndpoint="https://hachieve.runasp.net/api/Game/search"
      title="Trò chơi"
      additionalFilters={[
        {
          name: 'classify',
          placeholder: 'Tất cả',
          options: [
            // { value: '', label: 'Tất cả' },
            { value: 'Online', label: 'Online' },
            { value: 'Offline', label: 'Offline' }
          ]
        }
      ]}
    />
  );
};

export default Games;