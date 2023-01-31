import Icon from 'src/components/Icon/Icon.js'
import Tooltip from 'src/components/Tooltip/Tooltip.js'
import URLRedirects from 'src/components/URLRedirects/URLRedirects.js'

const ClientCredentials = ({ client }) => {
  return (
    <div className="flex w-full flex-col gap-y-4 overflow-auto rounded-md border border-gray-800 p-2">
      <div>
        <div key={client.id}>
          <div className="flex w-full flex-row justify-between">
            <div className="flex flex-col">
              <div className="flex gap-x-1 text-xs text-gray-800">
                CLIENT ID
                <Tooltip
                  id="client-id"
                  delayHideTime={250}
                  effect="float"
                  borderColor="#C6CED2"
                  bgColor="#eef0f2"
                  position="top"
                  tooltipChild={
                    <div className="text-black">Copy this into your app</div>
                  }
                >
                  <Icon color="fill-gray-800" name="tooltip" />
                </Tooltip>
              </div>
              <div className="flex font-light">{client.id}</div>
            </div>
            <div className="flex gap-x-3">
              <div className="flex flex-col">
                <div className="flex text-xs text-gray-800">CREATED BY</div>
                <div className="flex font-light">{client.createdBy}</div>
              </div>
              <div className="flex flex-col">
                <div className="flex gap-x-1 text-xs text-gray-800">
                  CREATED
                  <Tooltip
                    id="created"
                    delayHideTime={250}
                    effect="float"
                    borderColor="#C6CED2"
                    bgColor="#eef0f2"
                    position="top"
                    tooltipChild={
                      <div className="text-black">
                        Date when this client was first created
                      </div>
                    }
                  >
                    <Icon color="fill-gray-800" name="tooltip" />
                  </Tooltip>
                </div>
                <div className="flex font-light">{client.createdAt}</div>
              </div>
              <div className="flex flex-col">
                <div className="flex gap-x-1 text-xs text-gray-800">
                  LAST USED
                  <Tooltip
                    id="last-used"
                    elayHideTime={250}
                    effect="float"
                    borderColor="#C6CED2"
                    bgColor="#eef0f2"
                    position="top"
                    tooltipChild={
                      <div className="text-black">
                        Date when this client was last updated
                      </div>
                    }
                  >
                    <Icon color="fill-gray-800" name="tooltip" />
                  </Tooltip>
                </div>
                <div className="flex font-light">{client.updatedAt}</div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex">
            <URLRedirects client={client} />
          </div>
        </div>
      </div>
      <div className="flex w-full flex-row justify-between gap-x-2"></div>
    </div>
  )
}

export default ClientCredentials
