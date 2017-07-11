
const sparkles = {
  name: 'sparkles',
  src: 'https://cdn.glitch.com/2539c9eb-689e-4765-addb-baf19c7b5bf2%2Fsparkles.png?1496841442400',
};
const eye = {
  name: 'eye',
  src: 'https://cdn.glitch.com/2539c9eb-689e-4765-addb-baf19c7b5bf2%2Feye.png?1496842050045',
};
const mouth = {
  name: 'mouth',
  src: 'https://cdn.glitch.com/2539c9eb-689e-4765-addb-baf19c7b5bf2%2Fmouth.png?1496842076965',
};
const tongue = {
  name: 'tongue',
  src: 'https://cdn.glitch.com/2539c9eb-689e-4765-addb-baf19c7b5bf2%2Ftongue.png?1496841781303',
};
const fire = {
  name: 'fire',
  src: 'https://cdn.glitch.com/2539c9eb-689e-4765-addb-baf19c7b5bf2%2Ffire.png?1496842103467',
};
// const ogre = {
//   name: 'ogre',
//   src: 'https://cdn.glitch.com/7294edae-c141-414c-8ed1-53a7aeeca65c%2Forge.png?1497029823040',
// };
// const smile = {
//   name: 'smile',
//   src: 'https://cdn.glitch.com/7294edae-c141-414c-8ed1-53a7aeeca65c%2Fsmile.png?1497030263487',
// };
// const foxface = {
//   name: 'foxface',
//   src: 'https://cdn.glitch.com/7294edae-c141-414c-8ed1-53a7aeeca65c%2Ffoxface.png?1497030614401',
// };

const srcs = [
  sparkles,
  eye,
  mouth,
  tongue,
  fire,
  // ogre,
  // smile,
  // foxface,
];

export default function getImages () {
  return srcs.reduce((acc, img) => {
    acc[img.name] = document.createElement('img');
    acc[img.name].src = img.src;
    return acc;
  }, {});
}