import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ContactFormView from '@/views/ContactFormView.vue'
import { create } from '@/services/contacts'

// Mock the router: the tests focus on form validation, not navigation.
const { push, replace } = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn() }))
vi.mock('vue-router', () => ({
  useRouter: () => ({ push, replace }),
}))

const PICTURE = 'data:image/jpeg;base64,AAAA'

// Recent Node versions expose an experimental global localStorage that shadows
// jsdom's; use an in-memory implementation so tests run the same everywhere.
function createMemoryStorage() {
  let store = {}
  return {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => {
      store[key] = String(value)
    },
    removeItem: (key) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
}

vi.stubGlobal('localStorage', createMemoryStorage())

function mountForm(props = {}) {
  return mount(ContactFormView, {
    props,
    global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
  })
}

async function fillAndSubmit(wrapper, values) {
  for (const [field, value] of Object.entries(values)) {
    await wrapper.find(`#${field}`).setValue(value)
  }
  await wrapper.find('form').trigger('submit')
}

function errorMessages(wrapper) {
  return wrapper.findAll('.error').map((error) => error.text())
}

beforeEach(() => {
  localStorage.clear()
  push.mockClear()
})

describe('Add contact form validation', () => {
  it('shows an error for every required field when submitted empty', async () => {
    const wrapper = mountForm()
    await wrapper.find('form').trigger('submit')

    expect(errorMessages(wrapper)).toEqual([
      'Name must have more than 5 characters.',
      'Contact must have exactly 9 digits.',
      'Please enter a valid email address.',
      'A picture is required.',
    ])
    expect(push).not.toHaveBeenCalled()
  })

  it('rejects a short name, an invalid contact and an invalid email', async () => {
    const wrapper = mountForm()
    await fillAndSubmit(wrapper, { name: 'Abcde', contact: '12345678', email: 'invalid' })

    const messages = errorMessages(wrapper)
    expect(messages).toContain('Name must have more than 5 characters.')
    expect(messages).toContain('Contact must have exactly 9 digits.')
    expect(messages).toContain('Please enter a valid email address.')
  })

  it('rejects a contact number and email already in use', async () => {
    create({ name: 'Existing', contact: '912345678', email: 'taken@mail.com', picture: PICTURE })

    const wrapper = mountForm()
    await fillAndSubmit(wrapper, { name: 'New person', contact: '912345678', email: 'taken@mail.com' })

    const messages = errorMessages(wrapper)
    expect(messages).toContain('This contact number is already in use.')
    expect(messages).toContain('This email address is already in use.')
  })
})

describe('Edit contact form validation', () => {
  it('allows saving a contact with its own contact number and email', async () => {
    const contact = create({ name: 'Original', contact: '912345678', email: 'me@mail.com', picture: PICTURE })

    const wrapper = mountForm({ id: String(contact.id) })
    await fillAndSubmit(wrapper, { name: 'Updated name' })

    expect(errorMessages(wrapper)).toEqual([])
    expect(push).toHaveBeenCalled()
  })

  it('shows errors for invalid values when editing', async () => {
    const contact = create({ name: 'Original', contact: '912345678', email: 'me@mail.com', picture: PICTURE })

    const wrapper = mountForm({ id: String(contact.id) })
    await fillAndSubmit(wrapper, { name: 'Abc', email: 'wrong' })

    const messages = errorMessages(wrapper)
    expect(messages).toContain('Name must have more than 5 characters.')
    expect(messages).toContain('Please enter a valid email address.')
    expect(push).not.toHaveBeenCalled()
  })

  it("rejects another contact's email when editing", async () => {
    create({ name: 'First person', contact: '911111111', email: 'first@mail.com', picture: PICTURE })
    const second = create({ name: 'Second person', contact: '922222222', email: 'second@mail.com', picture: PICTURE })

    const wrapper = mountForm({ id: String(second.id) })
    await fillAndSubmit(wrapper, { email: 'first@mail.com' })

    expect(errorMessages(wrapper)).toContain('This email address is already in use.')
  })
})