import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import Icon from 'src/components/Icon/Icon.js'
import Tooltip from 'src/components/Tooltip/Tooltip.js'
import URLRedirects from 'src/components/URLRedirects/URLRedirects.js'

const CREATE_ClIENT = gql`
  mutation CreateContactMutation {
    createClient {
      id
    }
  }
`

const ClientCredentials = ({ client }) => {
  const [createClient, { loading, error }] = useMutation(CREATE_ClIENT, {
    onCompleted: () => {
      toast.success('Client created!')
    },
  })

  const onSubmit = () => {
    createClient()
  }

  let clientSecretSection

  function handleCopy() {
    navigator.clipboard.writeText(apiKey)
    setCopySuccess('Copied!')
    setTimeout(() => {
      setCopySuccess('Click to copy key')
    }, 2000)
  }

  // let regenerateConfirmationSection = (
  //   <div className="flex flex-col">
  //     <div className="font-light">
  //       Regenerate your API Key? The current one wil become invalid.
  //     </div>
  //     <div className="flex flex-row justify-end gap-x-2">
  //       <Button variant="green" onClick={() => generateAPIKey()}>
  //         Confirm
  //       </Button>
  //       <Button
  //         onClick={() => setRegenerateConfirmation(false)}
  //         size="regular"
  //         borderColor="border-gray-300"
  //         variant="transparent"
  //         textColor="text-gray-800"
  //       >
  //         Cancel
  //       </Button>
  //     </div>
  //   </div>
  // )

  // if (apiKey) {
  //   clientSecretSection = (
  //     <div className="flex h-fit w-fit rounded-md bg-red-100 p-2">
  //       <div className="flex flex-col">
  //         <div className="flex gap-x-1 text-red-1200">
  //           Secret
  //           <div className="mt-1 flex">
  //             <Tooltip
  //               id="secret-text"
  //               delayHideTime={250}
  //               effect="float"
  //               borderColor="#C6CED2"
  //               bgColor="#eef0f2"
  //               position="top"
  //               tooltipChild={
  //                 <div className="text-black">Placeholder text</div>
  //               }
  //             >
  //               <Icon color="fill-red-1200" name="tooltip" />
  //             </Tooltip>
  //           </div>
  //         </div>
  //         <div className="flex flex-row gap-x-2">
  //           <div className="flex font-light">{apiKey}</div>
  //           <button
  //             className="flex"
  //             onClick={() => {
  //               handleCopy()
  //             }}
  //           >
  //             <Tooltip
  //               id="client-secret"
  //               delayHideTime={250}
  //               effect="float"
  //               borderColor="#C6CED2"
  //               bgColor="#eef0f2"
  //               position="top"
  //               tooltipChild={<div className="text-black">{copySuccess}</div>}
  //             >
  //               <Icon color="fill-red-1200" name="copy" />
  //             </Tooltip>
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }
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
                  {/* <Tooltip
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
                  </Tooltip> */}
                </div>
                <div className="flex font-light">{client.createdAt}</div>
              </div>
              <div className="flex flex-col">
                <div className="flex gap-x-1 text-xs text-gray-800">
                  LAST USED
                  {/* <Tooltip
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
                  </Tooltip> */}
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
      <div className="flex w-full flex-row justify-between gap-x-2">
        {/* {clientSecretSection}
        <div className="flex items-end">
          {regenerateConfirmation ? (
            regenerateConfirmationSection
          ) : (
            <Button
              variant="green"
              onClick={() => setRegenerateConfirmation(true)}
            >
              Regenerate
            </Button>
          )}
        </div> */}
      </div>
    </div>
  )
}

export default ClientCredentials
