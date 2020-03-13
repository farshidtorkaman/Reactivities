import React from 'react'
import { Menu, Container, Button } from 'semantic-ui-react'

interface IPros {
    openCreateForm: () => void
}

export const Navbar: React.FC<IPros> = ({openCreateForm}) => {
    return (
        <Menu fixed='top' inverted>
            <Container>
                <Menu.Item header>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight: 10}} />
                    Reactivities
                </Menu.Item>
                <Menu.Item name='Activities' />
                <Menu.Item>
                    <Button onClick={() => openCreateForm()} positive content='Create Activity' />
                </Menu.Item>
            </Container>
        </Menu>
    )
}
