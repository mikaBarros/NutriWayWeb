import Layout from '../../components/Layout';
import pfp from '@/images/pfp.jpeg';

const ProfessionalProfile = () => (
  <Layout>
    <div className="page">
      <div className="professional">
        <div className="avatar xl"><img src={pfp.src} alt="Rayanne Soares Ribeiro"/></div>
        <h1>Rayanne Soares Ribeiro</h1>
        <p>Nutricionista</p>
        <div className="profile-options">
          <div>Dados pessoais</div>
          <div>Preferências do sistema</div>
          <div>Configurações</div>
        </div>
      </div>
    </div>
  </Layout>
);

export default ProfessionalProfile;
