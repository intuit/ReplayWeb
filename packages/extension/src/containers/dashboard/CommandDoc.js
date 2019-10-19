import { connect } from 'react-redux'

import CommandDoc from '../../components/dashboard/CommandDoc'

export default connect(
  state => ({
    commandPlugins: state.app.commandPlugins
  }),
  {}
)(CommandDoc)
