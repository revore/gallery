// var Site = React.createClass({
//   render: function() {
//     var link = "http://" + this.props.site.stub + ".paulmckellar.com"
//     return (
//       <div>
//         <h2>
//           <a href={ link }>
//             { this.props.site.name }
//           </a>
//         </h2>
//       </div>
//     );
//   }
// })


// var AppList = React.createClass({

//   getInitialState: function() {
//     return ({
//       sites: [],
//     });
//   },

//   render: function() {
//     var appNodes = this.props.sites.map(function(site) {
//       return <Site site={site} />;
//     });

//     return (
//       <div className="container">
//         {appNodes}
//       </div>
//     );
//   },
// });

var App = React.createClass({

  // getInitialState: function() {
  //   return ({
  //     sites: [],
  //   });
  // },

  // componentDidMount: function() {
  //   var t = this;

  //   $.ajax({
  //     url: "/i/sites",
  //     dataType: "json",
  //     success: function( sites ) {
  //       t.setState({
  //         sites: sites
  //       })
  //     }
  //   });
  // },

  render: function() {
    // var sites = this.state.sites;
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

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
