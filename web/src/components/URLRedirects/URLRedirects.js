import React, { useState } from 'react'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import Button from 'src/components/Button/Button'
import { QUERY as clientQuery } from 'src/components/ClientCell'
import Icon from 'src/components/Icon/Icon'
import TextInput from 'src/components/TextInput/TextInput'
import Tooltip from 'src/components/Tooltip/Tooltip'

const UPDATE_ClIENT = gql`
  mutation UpdateClientMutation($id: String!, $redirectUrls: String!) {
    updateClient(id: $id, redirectUrls: $redirectUrls) {
      id
    }
  }
`

const URLRedirects = ({ client }) => {
  const [updateClient, { loading, error }] = useMutation(UPDATE_ClIENT, {
    refetchQueries: [{ query: clientQuery }],
    onCompleted: () => {
      toast.success('Client updated')
    },
  })

  const onSubmit = async () => {
    const redirectUrls = urls.filter((url) => url.length > 1).join(',')
    await updateClient({ variables: { redirectUrls, id: client.id } })
  }
  const initialUrls = client.payload.redirect_uris
    ? [client.payload.redirect_uris, '']
    : ['']
  const [urls, setUrls] = useState(initialUrls)
  const [disabledURLs, setDisabledURLs] = useState(initialUrls)

  const handleAddURL = (index) => {
    const currentUrl = urls[index]
    if (!currentUrl.length) return alert('Please enter a URL')
    if (urls.length >= 5) {
      alert('Cannot add more than 5 URLs')
      return
    }
    // if (disabledURLs.includes(currentUrl)) {
    //   alert('You cannot add the same URL twice')
    //   document.getElementById(`url-${index}`).value = ''
    //   document.getElementById(`url-${index}`).disabled = false
    //   return
    // }
    if (!validateUrl(currentUrl)) {
      alert('Please enter a valid web address')
      return
    }
    setUrls([...urls.slice(0, index + 1), '', ...urls.slice(index + 1)])
    setDisabledURLs([...urls.slice(0, index + 1), '', ...urls.slice(index + 1)])
  }

  const validateUrl = (url) => {
    const pattern = new RegExp(
      '^((http||https):\\/\\/.)[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)$',
      'i'
    )
    return !!pattern.test(url)
  }

  const handleRemoveURL = (index) => {
    setUrls(urls.filter((_, i) => i !== index))
    setDisabledURLs(urls.filter((_, i) => i !== index))
  }

  const handleChange = (e, index) => {
    const newUrls = [...urls]
    newUrls[index] = e.target.value
    setUrls(newUrls)
  }

  return (
    <div className="flex w-full flex-col rounded-md border border-gray-800 p-2">
      <div className="flex gap-x-1">
        <h2 className="font-sans text-xs text-gray-800">URL REDIRECTS</h2>
        {/* <Tooltip
          id="url-redirects"
          delayHideTime={250}
          effect="float"
          borderColor="#C6CED2"
          bgColor="#eef0f2"
          position="top"
          tooltipChild={<div className="text-black">Placeholder text</div>}
        >
          <Icon color="fill-gray-800" name="tooltip" />
        </Tooltip> */}
      </div>
      <div className="flex flex-col">
        {urls.map((url, index) => (
          <div className="mb-4 w-full" key={index}>
            <div className="flex rounded-lg bg-white">
              <TextInput
                className="w-full rounded-lg border border-gray-400 p-2 placeholder-gray-400"
                placeholder="http://domain.com/redirect-url"
                value={url}
                onChange={(e) => handleChange(e, index)}
                readOnly={urls.length >= 5}
                disabled={disabledURLs.includes(url) && url !== ''}
                id={`url-${index}`}
              />
              <div className="ml-2">
                {index === urls.length - 1 ? (
                  <div>
                    {urls.length >= 5 ? (
                      <Button
                        classNameVariant="bg-red-500"
                        disabled={urls.length >= 5}
                      >
                        Max
                      </Button>
                    ) : (
                      <Button
                        disabled={urls.length >= 5}
                        onClick={() => handleAddURL(index)}
                        classNameVariant={`${
                          urls.length >= 5 ? 'bg-red-500' : ''
                        }`}
                        variant="green"
                      >
                        Add
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button
                    classNameVariant="bg-transparent border border-gray-800"
                    onClick={() => handleRemoveURL(index)}
                  >
                    <div className="text-gray-800">Remove</div>
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        <Button onClick={onSubmit} disabled={loading} variant="green">
          Save
        </Button>
        {error?.message}
      </div>
    </div>
  )
}

export default URLRedirects
