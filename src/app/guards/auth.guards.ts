import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import AuthService from '../services/auth.service.js'
import { map } from 'rxjs'

const authState = () => inject(AuthService).authState

export const publicGuard: CanActivateFn = () => {
  const router = inject(Router)

  return authState().pipe(
    map(user => {
      if (user) {
        router.navigateByUrl('/home', {replaceUrl: true})
      }

      return user === null
    })
  )
}

export const authGuard: CanActivateFn = () => {
  const router = inject(Router)

  return authState().pipe(
    map(user => {
      if (!user) {
        router.navigateByUrl('/login', {replaceUrl: true})
      }

      return user !== null
    })
  )
}
