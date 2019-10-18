import { connect } from 'react-redux'

import OneField from '../../../components/dashboard/fields/OneField'

export default connect(
  state => ({
    commandPlugins: state.app.commandPlugins
  }),
  {}
)(OneField)
