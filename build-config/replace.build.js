// https://www.bilyachat.com/blog/angular-2-build-version

var replace = require( "replace-in-file" );
var package = require( "../package.json" );
var buildVersion = package.version;
var dateFormatted = formatDate( new Date() )

const optionsEnvironment = {
  files: "src/environments/*.ts",
  from: /version: \"(.*)\"/g,
  to: `version: "${buildVersion}"`,
  allowEmptyPaths: false
};

const optionsAppVersion = {
  files: "src/assets/static/appversion.json",
  from: /\"appversion\": \"(.*)\"/g,
  to: `"appversion": "${buildVersion}"`,
  allowEmptyPaths: false
};

const optionsChangelogFile = {
  files: "CHANGELOG.md",
  from: /\[Unreleased\]/g,
  to: `[${buildVersion}] - ${dateFormatted}`,
  allowEmptyPaths: false
};

function formatDate( date ) {
  let d = new Date( date ),
    month = '' + ( d.getMonth() + 1 ),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if ( month.length < 2 )
    month = '0' + month;
  if ( day.length < 2 )
    day = '0' + day;

  return [day, month, year].join( '-' );
}

try {

/**
 * CHANGELOG
 */
  let changelogFile = replace.sync( optionsChangelogFile );
  if ( changelogFile == 0 ) {
    throw "Please make sure that file '" + optionsChangelogFile.files + "' has \[Unreleased\]";
  }
  console.log( `CHANGELOG file mutated` );
  /**
   * ENVIRONMENT FILES
   */
  let changedFiles = replace.sync( optionsEnvironment );
  if ( changedFiles == 0 ) {
    throw "Please make sure that file '" + optionsEnvironment.files + "' has \"version: ''\"";
  }
  console.log( `Build version set --- version: "${buildVersion}"` );
  /**
   * APPVERSION FILE
   */
  let changeAppversionFile = replace.sync( optionsAppVersion );
  if ( changeAppversionFile === 0 ) {
    throw "Please make sure that file '" + optionsAppVersion.files + "' has \"appversion: ''\"";
  }
  console.log( `appversion file set --- appversion: "${buildVersion}"` );
  
} catch ( error ) {
  console.error( "Error occurred:", error );
  throw error;
}
