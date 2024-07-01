import { Sequelize, Model, DataTypes } from 'sequelize';

const sequelize = new Sequelize('autostrade', 'root', 'root', {
  host: 'db',
  dialect: 'mysql',
});

class Utente extends Model {}
Utente.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  ruolo: { type: DataTypes.ENUM('operatore', 'varco', 'automobilista'), allowNull: false },
  token: { type: DataTypes.STRING, allowNull: false },
}, { sequelize, modelName: 'utente' });

class Veicolo extends Model {}
Veicolo.init({
  targa: { type: DataTypes.STRING, primaryKey: true },
  tipo: { type: DataTypes.STRING, allowNull: false },
}, { sequelize, modelName: 'veicolo' });

class Varco extends Model {}
Varco.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  posizione: { type: DataTypes.STRING, allowNull: false },
}, { sequelize, modelName: 'varco' });

class Tratta extends Model {}
Tratta.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  varcoInId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'varcos', key: 'id' } },
  varcoOutId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'varcos', key: 'id' } },
  distanza: { type: DataTypes.FLOAT, allowNull: false },
}, { sequelize, modelName: 'tratta' });

class Transito extends Model {}
Transito.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  veicoloTarga: { type: DataTypes.STRING, allowNull: false, references: { model: 'veicolos', key: 'targa' } },
  varcoId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'varcos', key: 'id' } },
  dataOra: { type: DataTypes.DATE, allowNull: false },
  pioggia: { type: DataTypes.BOOLEAN, allowNull: false },
}, { sequelize, modelName: 'transito' });

class Multa extends Model {}
Multa.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  transitoInId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'transitos', key: 'id' } },
  transitoOutId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'transitos', key: 'id' } },
  velocitaMedia: { type: DataTypes.FLOAT, allowNull: false },
  limiteVelocita: { type: DataTypes.FLOAT, allowNull: false },
}, { sequelize, modelName: 'multa' });

export { sequelize, Utente, Veicolo, Varco, Tratta, Transito, Multa };
