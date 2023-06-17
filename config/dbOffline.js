import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase("dboffline.db");
import { ToastAndroid } from 'react-native';

const init = async () => {
  db.transaction(tx => {
   // tx.executeSql('DROP TABLE usuario;')
    tx.executeSql('create table if not exists usuario (id INTEGER PRIMARY KEY AUTOINCREMENT, period INTEGER not null, program INTEGER not null, curp text not null, ap text not null, am text not null, nombres text not null, fec_nac text not null, cve_lugar_nac text not null, muni INTEGER not null, latitud REAL, longitud REAL, benef INTEGER not null, cantidad text not null, periodici INTEGER not null, tarjeta text not null, foto1 text not null, foto2 text not null);');
  }, (t, error) => console.log(error, " error al crear la tabla "));
}

const create = async (period, program, curpData, muni, latitud, longitud, benef, cantidad, periodici, tarjeta, fotos) => {
  const [curp, , ap, am, nombres, , fec_nac, , cve_lugar_nac] = curpData;
  const [foto1, foto2] = fotos;
  if(foto1[1].length > 10 && foto2[1].length > 10) {
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO usuario (period, program, curp, ap, am, nombres, fec_nac, cve_lugar_nac, muni, latitud, longitud, benef, cantidad, periodici, tarjeta, foto1, foto2) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
      [period, program, curp, ap, am, nombres, fec_nac, cve_lugar_nac, muni, latitud, longitud, benef, cantidad, periodici, tarjeta, foto1[1], foto2[1]]);
  },
    (t, error) => ToastAndroid.show(error, ToastAndroid.SHORT));
  }else{
    ToastAndroid.show("ERROR: Algunos valores estan vacios, vuelva a guardar al usuario ", ToastAndroid.SHORT);
  }
}

const find = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'select * from usuario;', [],
        (_, { rows: { _array } }) => resolve(_array)),
        (_, error) => reject(error)
    },
      (t, error) => console.log(error, " error find "));
  });
}

const remove = async (id) => {
  db.transaction((tx) => {
    tx.executeSql('DELETE FROM usuario WHERE id = ?;', [id])
  },
    (t, error) => console.log(error, " error remove "));
}

const notEmpty = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT count(id) AS result from usuario;', [],
        (_, result) => {
          resolve(result.rows.item(0))
        },
        (_, error) => reject(error))
    },
      (t, error) => console.log(error, " error notEmpty "));
  });
}

const tableInfo = async () => {
    db.exec([{ sql: 'PRAGMA table_info(usuario);', args: [] }], false, (e,r) => {
      console.log(r, " columnas de la tabla ", e) 
    }
  );
}

export default {
  init,
  create,
  find,
  remove,
  notEmpty,
  tableInfo
};