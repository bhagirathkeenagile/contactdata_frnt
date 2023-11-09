import { User, Tooltip } from '@nextui-org/react'
import { DeleteIcon, EditIcon, EyeIcon } from './icons'

export type User = {
    id:string
    Account: string
    FirstName: string
    LastName: string
    RingLeadScore: string
    Email: string
}

export const columns = [
  {
    key: 'Account',
    label: 'Account'
  },
  {
    key: 'FirstName',
    label: 'First Name'
  },
  {
    key: 'LastName',
    label: 'Last Name'
  },
  {
    key: 'RingLeadScore',
    label: 'Ring Lead Score'
  }
]

export const renderCell = (user: User, columnKey: React.Key) => {
  const cellValue = user[columnKey as keyof User]

  switch (columnKey) {
    case 'name':
      return (
        <User
          description={user.Email}
          name={cellValue}
        >
          {user.Email}
        </User>
      )
    case 'lastSeen':
      return <span>{new Date(cellValue).toLocaleDateString()}</span>
    case 'actions':
      return (
        <div className='relative flex items-center gap-4'>
          <Tooltip content='Details'>
            <span className='cursor-pointer text-lg text-default-400 active:opacity-50'>
              <EyeIcon />
            </span>
          </Tooltip>
          <Tooltip content='Edit user'>
            <span className='cursor-pointer text-lg text-default-400 active:opacity-50'>
              <EditIcon />
            </span>
          </Tooltip>
          <Tooltip color='danger' content='Delete user'>
            <span className='cursor-pointer text-lg text-danger active:opacity-50'>
              <DeleteIcon />
            </span>
          </Tooltip>
        </div>
      )
    default:
      return cellValue
  }
}