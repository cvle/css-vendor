/* eslint-disable func-names */

import expect from 'expect.js'
import {getSupport, currentBrowser} from 'caniuse-support'

import {prefix, supportedProperty, supportedValue} from './index'
import propertyPrefixFixture from '../test/fixtures/property-prefix'
import valueFixture from '../test/fixtures/value-prefix'

const msg = `Detected browser: ${currentBrowser.id} ${currentBrowser.version}`
console.log(msg) // eslint-disable-line no-console

describe('css-vendor', () => {
  describe('.prefix', () => {
    it('should be correct for .css', () => {
      const {css} = prefix
      expect(css).to.be.a('string')
      expect(css[0]).to.be('-')
      expect(css[css.length - 1]).to.be('-')
      expect(css.length >= 3).to.be(true)
    })

    it('shoud be not empty for .js', () => {
      expect(prefix.js).to.be.a('string')
    })
  })

  describe('.supportedProperty()', () => {
    it('should not prefix', () => {
      expect(supportedProperty('display')).to.be('display')
    })

    const opts = {multiple: true}
    for (const property in propertyPrefixFixture) {
      it(`should prefix ${property} if needed [${currentBrowser.id} ${currentBrowser.version}]`,
        () => expect(supportedProperty(property, opts)).to.eql(propertyPrefixFixture[property]))
    }

    it('should return false', () => {
      expect(supportedProperty('xxx')).to.be(false)
    })
  })

  describe('.supportedValue()', () => {
    it('should not prefix a simple value', () => {
      expect(supportedValue('display', 'none')).to.be('none')
    })

    it('should not prefix a complex value', () => {
      const value = 'rgba(255, 255, 255, 1.0)'
      expect(supportedValue('color', value)).to.be(value)
    })

    for (const testcase of valueFixture) {
      it(`should prefix '${testcase[0]}: ${testcase[1]}' if needed [${currentBrowser.id} ${currentBrowser.version}]`,
        () => expect(supportedValue(testcase[0], testcase[1])).to.eql(testcase[2]))
    }

    it('should prefix if needed', function () {
      const {level, needPrefix} = getSupport('flexbox')
      if (level !== 'full') this.skip()
      const value = needPrefix ? `${prefix.css}flex` : 'flex'
      expect(supportedValue('display', 'flex')).to.be(value)
    })

    it('should return false for unknown value', () => {
      expect(supportedValue('display', 'xxx')).to.be(false)
    })

    it('should return false for "content" value', () => {
      expect(supportedValue('content', 'bar')).to.be(false)
    })
  })
})
