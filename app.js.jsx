var Router = ReactRouter.Router;
var Link = ReactRouter.Link;
var Route = ReactRouter.Route;
var browserHistory = History.createHistory();

var MenuBar = React.createClass({
  render: function() {
    return (
      <nav className="navbar navbar-light">
        <ul className="nav navbar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link gs-grid"><i className="icon-th"></i></Link>
          </li>
          <li className="nav-item">
            <Link to="/upload" className="nav-link gs-download"><i className="icon-upload"></i></Link>
          </li>
        </ul>
      </nav>
    )
  },
});

var UploadBlock = React.createClass({
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
});

var Photo = React.createClass({
  render: function() {
    var linkUrl = "/photos/" + this.props.photo.id;
    return (
      <div key={this.props.photo.id} className="col-xs-12">
        <Link to={linkUrl}>
          <img src={this.props.photo.original} className="thumbnail photo" />
        </Link>
      </div>
    );
  },
});

// var PhotoPage = React.createClass({
//   render: function() {
//     console.log("h1llo");
//     return (
//       <h1>
//         hello
//       </h1>
//     );
//   }
// });

var PhotoGrid = React.createClass({
  render: function() {
    var photolist = this.props.photos.map(function(photo) {
      return (
        <Photo photo={photo} key={photo.id} />
      )
    });

    return (
      <div className="row">
        { photolist }
      </div>
    )
  }
});

var App = React.createClass({
  getInitialState() {
    return {
      photos: [],
    };
  },
  componentDidMount: function() {
    var t = this;
    $.get("/i/files.json", function(data) {
      t.setState({
        photos: data,
      })
    });
  },
  render: function() {
    if (this.state.main == undefined) {
      var mainContent = <PhotoGrid photos={this.state.photos} />;
    }
    return (
      <div>
        <MenuBar />
        {mainContent}
        {this.props.children}
      </div>
    );
  },
});

var routeSet = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="/upload" component={UploadBlock} />
    </Route>
  </Router>
)

ReactDOM.render(routeSet, document.getElementById('app'))
browserHistory.push(window.location.pathname);
