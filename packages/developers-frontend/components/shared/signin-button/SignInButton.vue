<script lang="ts">
import { defineComponent, onMounted } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    function messageHandler(evt: MessageEvent<any>) {
      if (evt.origin != 'http://localhost:5000' || !evt.data.type) return

      if (evt.data.type === 'authorization_response') {
        ;(evt.source as Window).close()

        if (evt.data.error) {
          // TODO: handle the error
        }

        const params = new URLSearchParams({
          code: evt.data.response.code
        })

        if (evt.data.response.state) {
          params.set('state', evt.data.response.state)
        }

        window.removeEventListener('message', messageHandler, false)

        window.location.replace(`/callback?${params.toString()}`)
      }
    }

    onMounted(() => {
      window.addEventListener('message', messageHandler, false)
    })

    return {
      handleSignIn() {
        window.open(
          '/signin',
          '_new',
          'location=yes,height=600,width=520,scrollbars=yes,status=yes'
        )
      }
    }
  }
})
</script>


<template>
  <b-button size="sm" class="my-2 my-sm-0" @click="handleSignIn"
    >Sign In</b-button
  >
</template>