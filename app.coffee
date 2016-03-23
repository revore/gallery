dropTarget = $('#dropbox')
messageTarget = $('.message', dropTarget)
imageRow = $('#image-row')
template = '<div class="thumbnail col-xs-3"><img/><div class="progressHolder"><div class="progress"></div></div></div>'
$('#dropbox').filedrop
  url: '/i/files.json'
  paramname: 'files'
  error: (err, file) ->
    switch err
      when 'BrowserNotSupported'
        alert 'browser does not support HTML5 drag and drop'
      when 'TooManyFiles'
        alert 'too many files at once'
      # when 'FileTooLarge'
      # when 'FileTypeNotAllowed'
      # when 'FileExtensionNotAllowed'
      else
        break
    return
  allowedfiletypes: [
    'image/jpeg'
    'image/png'
    'image/gif'
  ]
  allowedfileextensions: [
    '.jpg'
    '.jpeg'
    '.png'
    '.gif'
  ]
  maxfiles: 25
  maxfilesize: 20
  uploadStarted: (i, file, len) ->
    imageDom = $(template)
    image = $('img', imageDom)
    fileReader = new FileReader
    image.width = 100
    image.height = 100

    fileReader.onload = (e) ->
      image.attr 'src', e.target.result
      return

    fileReader.readAsDataURL file
    messageTarget.text 'Uploading...'
    imageDom.appendTo imageRow
    $.data file, imageDom
    return
  progressUpdated: (i, file, progress) ->
    $.data(file).find('.progress').width progress + '%'
    if progress == 100
      $('.progress').hide()
    return

