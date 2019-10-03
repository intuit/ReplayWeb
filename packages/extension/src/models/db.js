import Dexie from 'dexie';
// dexie is a indexdb wrapper

const db = new Dexie('replaykit-ide');

db.version(1).stores({
  testCases: 'id,projectId,name,updateTime',
  projects: 'id,name,updateTime'
});
db.version(2).stores({
  testCases: 'id,projectId,name,updateTime',
  blocks: 'id,projectId,name,updateTime',
  projects: 'id,name,updateTime'
});
db.version(3).stores({
  testCases: 'id,projectId,name,updateTime',
  blocks: 'id,projectId,name,updateTime',
  projects: 'id,name,updateTime,projectPath,testPath,blockPath,suites'
});
db.version(4).stores({
  testCases: 'id,projectId,name,updateTime',
  blocks: 'id,projectId,name,updateTime',
  projects: 'id,name,updateTime,projectPath,testPath,blockPath,suites',
  suites: 'id,name,projectId,updateTime'
});

db.open();

export default db;
