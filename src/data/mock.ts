export interface PatientSummary {
  id: number;
  name: string;
  photo: string;
}

export interface Patient extends PatientSummary {
  fullName: string;
  age: number;
  birth: string;
  goal: string;
  progress: number;
}

export interface PatientDetails {
  intestinal?: string;
  smoker?: string;
  sleep?: string;
  alcohol?: string;
  marital?: string;
  activity?: string;
  race?: string;
  other?: string;
  pathologies?: string;
  medication?: string;
}

export interface Meal {
  time: string;
  meal: string;
  items: string[];
}

export const patients: Patient[] = [
  { id: 1, name: 'Emily V.', fullName: 'Emily Vitória', age: 24, birth: '14/03/2002', photo: 'https://img.magnific.com/vetores-premium/icone-de-perfil-de-avatar-padrao-imagem-de-usuario-de-midia-social-icone-de-avatar-cinza-silhueta-de-perfil-em-branco-ilustracao-vetorial_561158-3407.jpg?semt=ais_hybrid&w=740&q=80', goal: 'Emagrecimento', progress: 68 },
  { id: 2, name: 'Lucas', fullName: 'Lucas Almeida', age: 31, birth: '22/08/1995', photo: 'https://img.magnific.com/vetores-premium/icone-de-perfil-de-avatar-padrao-imagem-de-usuario-de-midia-social-icone-de-avatar-cinza-silhueta-de-perfil-em-branco-ilustracao-vetorial_561158-3407.jpg?semt=ais_hybrid&w=740&q=80', goal: 'Ganho de massa', progress: 54 },
  { id: 3, name: 'Gabriela', fullName: 'Gabriela Santos', age: 27, birth: '06/11/1998', photo: 'https://img.magnific.com/vetores-premium/icone-de-perfil-de-avatar-padrao-imagem-de-usuario-de-midia-social-icone-de-avatar-cinza-silhueta-de-perfil-em-branco-ilustracao-vetorial_561158-3407.jpg?semt=ais_hybrid&w=740&q=80', goal: 'Reeducação alimentar', progress: 81 },
  { id: 4, name: 'Mikaela', fullName: 'Mikaela Barros Cunha', age: 14, birth: '12/06/2012', photo: 'https://img.magnific.com/vetores-premium/icone-de-perfil-de-avatar-padrao-imagem-de-usuario-de-midia-social-icone-de-avatar-cinza-silhueta-de-perfil-em-branco-ilustracao-vetorial_561158-3407.jpg?semt=ais_hybrid&w=740&q=80', goal: 'Saúde e bem-estar', progress: 72 }
];

export const patientDetails: Record<number, PatientDetails> = {
  4: { intestinal: 'Regular', smoker: 'Não', sleep: '8 horas', alcohol: 'Não', marital: 'Solteira', activity: 'Moderada', race: 'Parda', other: '', pathologies: 'Nenhuma', medication: 'Nenhuma' }
};

export const mealPlan: Meal[] = [
  { time: '07:30', meal: 'Café da manhã', items: ['1 ovo mexido', '1 fatia de pão integral', '1 banana', 'Café sem açúcar'] },
  { time: '10:30', meal: 'Lanche da manhã', items: ['Iogurte natural', '1 porção de frutas'] },
  { time: '12:30', meal: 'Almoço', items: ['Arroz integral', 'Feijão', 'Frango grelhado', 'Salada variada'] },
  { time: '16:00', meal: 'Lanche da tarde', items: ['Tapioca', 'Queijo branco'] },
  { time: '19:30', meal: 'Jantar', items: ['Sopa de legumes', 'Frango desfiado'] }
];
