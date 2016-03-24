var DownloadBlock = React.createClass({
  componentDidMount: function() {

    var dropTarget, imageRow, messageTarget, template;
    dropTarget = $('#dropbox');
    messageTarget = $('.message', dropTarget);
    imageRow = $('#image-row');
    template = '<div class="thumbnail col-xs-3"><img/><div class="progressHolder"><div class="progress"></div></div></div>';
    return $('#dropbox').filedrop({
      url: '/i/files.json',
      paramname: 'files',
      error: function(err, file) {
        switch (err) {
          case 'BrowserNotSupported':
            alert('browser does not support HTML5 drag and drop');
            break;
          case 'TooManyFiles':
            alert('too many files at once');
            break;
          default:
            break;
        }
      },
      allowedfiletypes: ['image/jpeg', 'image/png', 'image/gif'],
      allowedfileextensions: ['.jpg', '.jpeg', '.png', '.gif'],
      maxfiles: 25,
      maxfilesize: 20,
      uploadStarted: function(i, file, len) {
        var fileReader, image, imageDom;
        imageDom = $(template);
        image = $('img', imageDom);
        fileReader = new FileReader;
        image.width = 100;
        image.height = 100;
        fileReader.onload = function(e) {
          image.attr('src', e.target.result);
        };
        fileReader.readAsDataURL(file);
        messageTarget.text('Uploading...');
        imageDom.appendTo(imageRow);
        $.data(file, imageDom);
      },
      progressUpdated: function(i, file, progress) {
        $.data(file).find('.progress').width(progress + '%');
        if (progress === 100) {
          $('.progress').hide();
        }
      }
    });

  },

  render: function() {
    return (
      <div id="dropbox-wrapper">

        <div className="row">
          <div className="col-xs-6 col-xs-offset-3">

            <div id="dropbox" className="clearfix">
              <span className="message">
                Drop files here to upload. <br />
              </span>
            </div>

          </div>
        </div>

        <div id="image-row" className="row">
        </div>

      </div>
    );
  },
})

var App = React.createClass({
  render: function() {
    return (
      <DownloadBlock />
    );
  },
});

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;

ReactDOM.render((
  <Router>
    <Route path="/" component={App} />
  </Router>
), document.getElementById('app'))
