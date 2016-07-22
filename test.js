var expect   = require('chai').expect
  , document = require('browserenv')
  , form = require('./')
  , root

describe('form', function() {

  beforeEach(function(){
    document.body.innerHTML = '<form></form>'
    root = document.body.firstChild
  })

  it('should collect values from text input', function() {
    root.innerHTML = '<input name="foo" value="bar">'
    expect(form(root)).to.eql({ values: { foo: 'bar' }, invalid: [] })
  })

  it('should collect values from custom elements', function() {
    root.innerHTML = '<custom-input name="foo">'
    root.firstChild.state = { value: 'bar' }
    expect(form(root)).to.eql({ values: { foo: 'bar' }, invalid: [] })
  })

  it('should collect values from file inputs', function() {
    root.innerHTML = '<input name="foo" value="bar" type="file">'
    expect(form(root).values.foo instanceof window.FileList).to.be.ok
  })

  it('should collect values from checkboxes', function() {
    root.innerHTML = 
      '<input name="foo" value="boo" type="checkbox">'
    + '<input name="foo" value="bar" type="checkbox" checked>'
    + '<input name="foo" value="baz" type="checkbox" checked>'

    expect(form(root)).to.eql({ values: { foo: ['bar', 'baz'] }, invalid: [] })
  })

  it('should collect values from radio elements', function() {
    root.innerHTML = 
      '<input name="foo" value="boo" type="radio">'
    + '<input name="foo" value="bar" type="radio">'
    + '<input name="foo" value="baz" type="radio" checked>'

    expect(form(root)).to.eql({ values: { foo: 'baz' }, invalid: [] })
  })

  it('should highlight invalid elements', function() {
    root.innerHTML = 
      '<input name="foo" class="is-invalid">'
    + '<input name="bar">'
    + '<input name="baz" class="is-invalid">'

    expect(form(root).invalid).to.include(root.firstChild)
    expect(form(root).invalid).to.include(root.lastChild)
  })

})