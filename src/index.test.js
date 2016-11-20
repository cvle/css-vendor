/* eslint-disable func-names, no-console */

import expect from 'expect.js'

import {prefix, supportedProperty, supportedValue} from './index'
import {getSupport, browserId, browserVersion} from '../test/utils'

console.log(`Detected browser: ${browserId} ${browserVersion}`)

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

    it('should prefix if needed', function () {
      const support = getSupport('transforms2d')
      if (!support.full && !support.partial) this.skip()
      const prop = support.needPrefix ? `${prefix.css}transform` : 'transform'
      expect(supportedProperty('transform')).to.be(prop)
    })

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

    it('should prefix if needed', function () {
      const support = getSupport('flexbox')
      if (!support.full) this.skip()
      const value = support.needPrefix ? `${prefix.css}flex` : 'flex'
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
