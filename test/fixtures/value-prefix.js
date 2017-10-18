import {getSupport, currentBrowser, getVersionIndex} from 'caniuse-support'
import autoprefixer from 'autoprefixer'
import apData from 'autoprefixer/data/prefixes'
import postcssJs from 'postcss-js'
import {dashify} from '../utils'

const browserQuery = `${currentBrowser.id} ${getVersionIndex(currentBrowser)}`
const ap = autoprefixer({browsers: browserQuery})
const prefixer = postcssJs.sync([ap])

const data = {
  // Skip supporting filter as a value. Only Safari supports it and it does not
  // seem to be a standard.
  /*
  'css-filter-function': {
    props: [
      'background', 'background-image', 'border-image', 'mask',
      'list-style', 'list-style-image', 'content', 'mask-image',
    ],
    value: "-webkit-filter(url('image.jpg'), blur(2px))",
  },
  */
  'css-gradients': {
    props: [
      'background', 'background-image', // 'border-image', 'mask',
      // 'list-style', 'list-style-image', 'content', 'mask-image',
    ],
    values: [
      "linear-gradient(350.5deg, white, black)",
      "radial-gradient(16px at 60px 50% , #000000 0%, #000000 14px, rgba(0, 0, 0, 0.3) 18px, rgba(0, 0, 0, 0) 19px)",
      "repeating-linear-gradient(to bottom right, black, white)",
      "repeating-radial-gradient(16px at 60px 50% , #000000 0%, #000000 14px, rgba(0, 0, 0, 0.3) 18px, rgba(0, 0, 0, 0) 19px)",
    ],
  },
  'flexbox': {
    props: [
      'display',
    ],
    values: [
      "flex",
    ],
  },
  'calc': {
    props: [
      'height',
    ],
    values: [
      "calc(1px + 1px)",
    ],
  },
};

function generateFixture() {
  const fixture = []
  Object.keys(data).
    map(key => data[key]).
    forEach(o => {
      o.props.forEach(p => {
        o.values.forEach(v => {
          let result = prefixer({[p]: v});
          fixture.push([p, v, result[Object.keys(result)[0]]])
        });
      });
    })
  return fixture
}

console.log(generateFixture());

export default generateFixture()

