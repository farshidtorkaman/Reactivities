import { RootStore } from './rootStore'
import { IProfile, IPhoto } from '../models/profile'
import { observable, action, runInAction, computed, reaction } from 'mobx'
import agent from '../api/agent'
import { toast } from 'react-toastify'

export default class ProfileStore {
    rootStore: RootStore
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore

        reaction(
            () => this.activeTab,
            activeTab => {
                if (activeTab === 3 || activeTab === 4) {
                    const predicate = activeTab === 3 ? 'followers' : 'following'
                    this.loadFollowings(predicate)
                }
                else {
                    this.followings = []
                }
            }
        )
    }

    @observable profile: IProfile | null = null
    @observable loadingProfile = true
    @observable uploadingPhoto = false
    @observable loading = false
    @observable submitting = false
    @observable followings: IProfile[] = []
    @observable activeTab: number = 0

    @computed get isCurrentUser() {
        if (this.rootStore.userStore.user && this.profile) {
            return this.rootStore.userStore.user.username === this.profile.username
        }
        else {
            return false
        }
    }

    @action setActiveTab = (activeIndex: number) => {
        this.activeTab = activeIndex
    }

    @action loadProfile = async (username: string) => {
        this.loadingProfile = true
        try {
            const profile = await agent.Profiles.get(username)
            runInAction(() => {
                this.profile = profile
                this.loadingProfile = false
            })
        } catch (error) {
            runInAction(() => {
                this.loadingProfile = false
            })
            console.log(error)
        }
    }

    @action uploadPhoto = async (file: Blob) => {
        this.uploadingPhoto = true
        try {
            const photo = await agent.Profiles.uploadPhoto(file)
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos.push(photo)
                    if (photo.isMain && this.rootStore.userStore.user) {
                        this.rootStore.userStore.user.image = photo.url
                        this.profile.image = photo.url
                    }
                }
                this.uploadingPhoto = false
            })
        } catch (error) {
            runInAction(() => {
                this.uploadingPhoto = false
            })
            console.log(error)
            toast.error('Problem uploading Photo')
        }
    }

    @action setMain = async (photo: IPhoto) => {
        this.loading = true
        try {
            await agent.Profiles.setMainPhoto(photo.id)
            runInAction(() => {
                this.rootStore.userStore.user!.image = photo.url
                this.profile!.photos.find(f => f.isMain)!.isMain = false
                this.profile!.photos.find(f => f.id === photo.id)!.isMain = true
                this.profile!.image = photo.url
                this.loading = false
            })
        } catch (error) {
            runInAction(() => {
                this.loading = false
            })
            console.log(error)
            toast.error('problem in setting main photo')
        }
    }

    @action deletePhoto = async (photo: IPhoto) => {
        this.loading = true
        try {
            await agent.Profiles.deletePhoto(photo.id)
            runInAction(() => {
                this.profile!.photos = this.profile!.photos.filter(f => f.id !== photo.id)
                this.loading = false
            })
        } catch (error) {
            runInAction(() => {
                this.loading = false
            })
            toast.error('Problem deleting the photo')
        }
    }

    @action updateProfile = async (profile: IProfile) => {
        this.submitting = true
        try {
            await agent.Profiles.edit(profile)
            runInAction(() => {
                this.profile = profile
                this.rootStore.userStore.user!.displayName = profile.displayName
                this.submitting = false
            })
        } catch (error) {
            runInAction(() => {
                this.submitting = false
            })
            toast.error('problem saving your data')
        }
    }

    @action follow = async (username: string) => {
        this.loading = true
        try {
            await agent.Profiles.follow(username)
            runInAction(() => {
                this.profile!.following = true
                this.profile!.followersCount++
                this.loading = false
            })
        } catch (error) {
            runInAction(() => {
                this.loading = false
            })
            toast.error('problem following the user')
        }
    }

    @action unfollow = async (username: string) => {
        this.loading = true
        try {
            await agent.Profiles.unfollow(username)
            runInAction(() => {
                this.profile!.following = false
                this.profile!.followersCount--
                this.loading = false
            })
        } catch (error) {
            runInAction(() => {
                this.loading = false
            })
            toast.error('problem unfollowing the user')
        }
    }

    @action loadFollowings = async (predicate: string) => {
        this.loading = true
        try {
            const profiles = await agent.Profiles.listFollowings(this.profile!.username, predicate)
            runInAction(() => {
                this.followings = profiles
                this.loading = false
            })
        } catch (error) {
            runInAction(() => {
                this.loading = false
            })
            toast.error('problem loading followings')
        }
    }
}