/**
Collapse a Test case that has already been expanded with blocks
Put in the "expandedindex" so that each item knows where the index was after it was expanded
**/
export const collapseExpandedTestCase = commands => {
  const { resultList } = commands.reduce(
    (current, nextCommand, index) => {
      if (nextCommand.isBlock) {
        return {
          isRunningBlock: true,
          resultList: current.isRunningBlock
            ? current.resultList
            : [
                ...current.resultList,
                {
                  ...nextCommand,
                  expandedIndex: index
                }
              ]
        }
      }
      return {
        isRunningBlock: false,
        resultList: [
          ...current.resultList,
          {
            ...nextCommand,
            expandedIndex: index
          }
        ]
      }
    },
    {
      isRunningBlock: false,
      resultList: []
    }
  )
  return resultList
}
