/* eslint-disable no-param-reassign */
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {PrefrenceObject} from 'datalib/entity/prefrence';
import {Subscription} from 'datalib/entity/subscription';
import {Integration, UserIntegration} from 'datalib/entity/systemIntegration';
import {Team, TeamMember, Role} from 'datalib/entity/team';
import {Organisation, User, UserProfile} from 'datalib/entity/user';
import TeamApi from 'datalib/services/team.api';
import UserApi from 'datalib/services/user.api';
import GAlert, {MessageType} from 'library/common/GAlert';
import {PrefrenceKeyEnum} from '../../models/common/preference.keys.enum';

import {
  defaultThunkFailureState,
  defaultThunkLoadingState,
  defaultThunkSuccessState,
} from '../../models/common/thunk.config';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';
import {ThunkStatus} from '../../models/common/thunkStatus.interface';
import {Nillable} from '../../models/custom.types';
import {RootState} from '../app.store';
import {
  cancelUserSubscription,
  createUserSubscription,
  getSubscriptionPlan,
  getUserSubscription,
  updateUserSubscription,
} from './actions/Subscription';
import {PaginationQuery} from 'datalib/entity/paginatedResult';
import {Digitalcard} from 'datalib/entity/digitalcard';
import {
  createDigitalCard,
  getDigitalCard,
  updateDigitalCard,
} from './actions/DigitalCard';
import {getReferredUsers} from './actions/User';

interface UserState {
  user: Nillable<User>;
  referredUsers: Array<object>;
  digitalCard: Nillable<Digitalcard>;
  subscriptionPlan: Array<Subscription>;
  findUserByMobileStatus: ThunkStatus;
  getUserByIdStatus: ThunkStatus;
  useProfileStatus: ThunkStatus;
  udatePrefranceStatus: ThunkStatus;
  fetchTeamStatus: ThunkStatus;
  fetchTeamMemberStatus: ThunkStatus;
  updateTeamStatus: ThunkStatus;
  deleteTeamStatus: ThunkStatus;
  updateTeamMemberStatus: ThunkStatus;
  fetchSubscriptionStatus: ThunkStatus;
  createSubscriptionStatus: ThunkStatus;
  fetchRolesStatus: ThunkStatus;
  fetchDigitalCardStatus: ThunkStatus;
  fetchreferredUsersStatus: ThunkStatus;
}

const initialThunkState = {status: ThunkStatusEnum.IDLE, error: null};

const initialState: UserState = {
  user: null,
  digitalCard: null,
  subscriptionPlan: [],
  referredUsers: [],
  findUserByMobileStatus: initialThunkState,
  getUserByIdStatus: initialThunkState,
  useProfileStatus: initialThunkState,
  udatePrefranceStatus: initialThunkState,
  fetchTeamStatus: initialThunkState,
  fetchTeamMemberStatus: initialThunkState,
  updateTeamStatus: initialThunkState,
  deleteTeamStatus: initialThunkState,
  updateTeamMemberStatus: initialThunkState,
  fetchSubscriptionStatus: initialThunkState,
  createSubscriptionStatus: initialThunkState,
  fetchRolesStatus: initialThunkState,
  fetchDigitalCardStatus: initialThunkState,
  fetchreferredUsersStatus: initialThunkState,
};

export const getUserById = createAsyncThunk<User, void, {rejectValue: string}>(
  'user/getUserById',
  async (user, {rejectWithValue}) => {
    try {
      return await new UserApi().getUser();
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const getUserIntegration = createAsyncThunk<
  Array<UserIntegration>,
  void,
  {rejectValue: string}
>('user/get-user-integration', async (user, {rejectWithValue}) => {
  try {
    return await new UserApi().getUserIntegration();
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const saveOnBoardingdata = createAsyncThunk<
  boolean,
  UserProfile,
  {rejectValue: string}
>('user/onboarding', async (data: UserProfile, {rejectWithValue}) => {
  try {
    return await new UserApi().saveOnBoardData(data);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const updteUserProfile = createAsyncThunk<
  boolean,
  any,
  {rejectValue: string}
>('user/profile-update', async (data: UserProfile, {rejectWithValue}) => {
  try {
    return await new UserApi().updteUserProfile(data);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});

export const setUserProfile = createAsyncThunk<
  User,
  void,
  {rejectValue: string}
>('user/profile', async (oid, {rejectWithValue}) => {
  try {
    return await new UserApi().getUser();
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const updateUserPrefrence = createAsyncThunk<
  boolean,
  {key: string; value: any},
  {rejectValue: string}
>(
  'user/pref-update',
  async (preference: {key: string; value: any}, {rejectWithValue}) => {
    try {
      return await new UserApi().updatePreference({
        [preference.key]: preference.value,
      });
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const setUserInStore = createAsyncThunk<
  User,
  User,
  {rejectValue: string}
>('user/profile-in-store', async (user: User, {rejectWithValue}) => {
  try {
    return user;
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});

export const getTeamMembers = createAsyncThunk<
  Array<TeamMember>,
  PaginationQuery,
  {rejectValue: string}
>(
  'user/get-members',
  async (queryFilter: PaginationQuery, {rejectWithValue}) => {
    try {
      return new TeamApi().getAllEmployee(queryFilter);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const addTeamMember = createAsyncThunk<
  TeamMember,
  TeamMember,
  {rejectValue: string}
>(
  'user/team-member-create',
  async (employee: TeamMember, {rejectWithValue}) => {
    try {
      return new TeamApi().createEmployee(employee);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const updateTeamMember = createAsyncThunk<
  Boolean,
  TeamMember,
  {rejectValue: string}
>(
  'user/team-member-update',
  async (employee: TeamMember, {rejectWithValue}) => {
    try {
      return new TeamApi().updateEmployee(employee);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);

export const getTeams = createAsyncThunk<
  Array<Team>,
  any,
  {rejectValue: string}
>('user/get-teams', async (filterParam: any, {rejectWithValue}) => {
  try {
    return new TeamApi().getAllTeams(filterParam);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const addTeam = createAsyncThunk<Team, Team, {rejectValue: string}>(
  'user/team-create',
  async (team: Team, {rejectWithValue}) => {
    try {
      return new TeamApi().createTeam(team);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const updateTeam = createAsyncThunk<
  Boolean,
  Team,
  {rejectValue: string}
>('user/team-update', async (team: Team, {rejectWithValue}) => {
  try {
    return new TeamApi().updateTeam(team);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const deleteTeam = createAsyncThunk<
  Boolean,
  string,
  {rejectValue: string}
>('user/team-delete', async (teamId: string, {rejectWithValue}) => {
  try {
    return new TeamApi().deleteTeamById(teamId);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const deleteMyAccount = createAsyncThunk<
  Boolean,
  void,
  {rejectValue: string}
>('user/user-delete', async (_undefined, {rejectWithValue}) => {
  try {
    return new UserApi().deleteMyAccount();
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const deleteEmployeeAccount = createAsyncThunk<
  Boolean,
  string,
  {rejectValue: string}
>('user/employee-delete', async (userId: string, {rejectWithValue}) => {
  try {
    return new UserApi().deleteEmployeeAccount(userId);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const getAllRoles = createAsyncThunk<
  Array<Role>,
  void,
  {rejectValue: string}
>('user/get-roles', async (undefined, {rejectWithValue}) => {
  try {
    return new TeamApi().getAllRoles();
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});

// TODO: Remove boilerplate?
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    restoreUserStore: () => initialState,
  },
  extraReducers: builder => {
    builder.addCase(updateUserPrefrence.pending, state => {
      state.udatePrefranceStatus = defaultThunkLoadingState;
    });
    builder.addCase(updateUserPrefrence.fulfilled, (state, action) => {
      state.udatePrefranceStatus = defaultThunkSuccessState;
      if (state.user && state.user.userPreference) {
        state.user.userPreference[action.meta.arg.key] = action.meta.arg.value;
      }
    });
    builder.addCase(updateUserPrefrence.rejected, (state, _action) => {
      state.udatePrefranceStatus = {
        ...defaultThunkFailureState,
        error: 'Error in preference update',
      };
    });
    builder.addCase(getUserById.pending, state => {
      state.getUserByIdStatus = defaultThunkLoadingState;
    });
    builder.addCase(getUserById.fulfilled, (state, action) => {
      state.getUserByIdStatus = defaultThunkSuccessState;
      state.user = action.payload;
    });
    builder.addCase(getUserById.rejected, (state, action) => {
      state.getUserByIdStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    //user context

    builder.addCase(setUserProfile.pending, state => {
      state.useProfileStatus = defaultThunkLoadingState;
    });
    builder.addCase(setUserProfile.fulfilled, (state, action) => {
      state.useProfileStatus = defaultThunkSuccessState;
      console.log('USER => ', action.payload);
      state.user = action.payload;
    });
    builder.addCase(setUserProfile.rejected, (state, action) => {
      state.useProfileStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(setUserInStore.pending, state => {
      state.useProfileStatus = defaultThunkLoadingState;
    });
    builder.addCase(setUserInStore.fulfilled, (state, action) => {
      state.useProfileStatus = defaultThunkSuccessState;
      state.user = action.payload;
    });
    builder.addCase(setUserInStore.rejected, (state, action) => {
      state.useProfileStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(saveOnBoardingdata.pending, state => {
      state.useProfileStatus = defaultThunkLoadingState;
    });
    builder.addCase(saveOnBoardingdata.fulfilled, (state, _action) => {
      if (state.user) {
        state.user.isOnboardCompleted = true;
      }
    });
    builder.addCase(saveOnBoardingdata.rejected, (state, action) => {
      state.useProfileStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(updteUserProfile.pending, state => {
      state.useProfileStatus = defaultThunkLoadingState;
    });
    builder.addCase(updteUserProfile.fulfilled, (state, _action) => {
      state.useProfileStatus = defaultThunkSuccessState;
      if (state.user) {
        state.user = {...state.user, ..._action.meta.arg};
      }
    });
    builder.addCase(updteUserProfile.rejected, (state, action) => {
      state.useProfileStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    builder.addCase(getTeamMembers.pending, state => {
      state.fetchTeamMemberStatus = defaultThunkLoadingState;
    });
    builder.addCase(getTeamMembers.fulfilled, (state, action) => {
      state.fetchTeamMemberStatus = {
        ...defaultThunkSuccessState,
        statusMessage: 'success',
      };
      if (state.user) {
        state.user.organizationEmployee = action.payload;
      }
    });
    builder.addCase(getTeamMembers.rejected, (state, action) => {
      state.fetchTeamMemberStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    builder.addCase(addTeamMember.pending, state => {
      state.updateTeamMemberStatus = defaultThunkLoadingState;
    });
    builder.addCase(addTeamMember.fulfilled, (state, action) => {
      state.updateTeamMemberStatus = {
        ...defaultThunkSuccessState,
        statusMessage: 'success',
      };
      if (action.payload && state.user) {
        state.user.organizationEmployee?.push(action.payload);
      }
    });
    builder.addCase(addTeamMember.rejected, (state, action) => {
      state.updateTeamMemberStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    builder.addCase(updateTeamMember.pending, state => {
      state.updateTeamMemberStatus = defaultThunkLoadingState;
    });
    builder.addCase(updateTeamMember.fulfilled, (state, _action) => {
      state.updateTeamMemberStatus = defaultThunkSuccessState;
    });
    builder.addCase(updateTeamMember.rejected, (state, action) => {
      state.updateTeamMemberStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(deleteEmployeeAccount.pending, state => {
      state.updateTeamMemberStatus = defaultThunkLoadingState;
    });
    builder.addCase(deleteEmployeeAccount.fulfilled, (state, _action) => {
      state.updateTeamMemberStatus = defaultThunkSuccessState;
      if (state.user) {
        state.user.organizationEmployee =
          state.user.organizationEmployee?.filter(
            _u => _u._id !== _action.meta.arg,
          );
      }
    });
    builder.addCase(deleteEmployeeAccount.rejected, (state, action) => {
      state.updateTeamMemberStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    builder.addCase(getTeams.pending, state => {
      state.fetchTeamStatus = defaultThunkLoadingState;
    });
    builder.addCase(getTeams.fulfilled, (state, action) => {
      state.fetchTeamStatus = {
        ...defaultThunkSuccessState,
        statusMessage: 'success',
      };
      if (state.user) {
        state.user.organizationTeams = action.payload;
      }
    });
    builder.addCase(getTeams.rejected, (state, action) => {
      state.fetchTeamStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    builder.addCase(addTeam.pending, state => {
      state.updateTeamStatus = defaultThunkLoadingState;
    });
    builder.addCase(addTeam.fulfilled, (state, _action) => {
      state.updateTeamStatus = {
        ...defaultThunkSuccessState,
        statusMessage: 'success',
      };
    });
    builder.addCase(addTeam.rejected, (state, action) => {
      state.updateTeamStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    builder.addCase(updateTeam.pending, state => {
      state.updateTeamStatus = defaultThunkLoadingState;
    });
    builder.addCase(updateTeam.fulfilled, (state, _action) => {
      state.updateTeamStatus = {
        ...defaultThunkSuccessState,
        statusMessage: 'success',
      };
    });
    builder.addCase(updateTeam.rejected, (state, action) => {
      state.updateTeamStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    builder.addCase(deleteTeam.pending, state => {
      state.updateTeamStatus = defaultThunkLoadingState;
    });
    builder.addCase(deleteTeam.fulfilled, (state, _action) => {
      state.updateTeamStatus = {
        ...defaultThunkSuccessState,
        statusMessage: 'success',
      };
      if (state.user) {
        state.user.organizationTeams = state.user.organizationTeams?.filter(
          _i => _i._id !== _action.meta.arg,
        );
      }
      GAlert('Team deleted successfully', MessageType.SUCCESS);
    });
    builder.addCase(deleteTeam.rejected, (state, action) => {
      state.deleteTeamStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(getSubscriptionPlan.pending, state => {
      state.fetchSubscriptionStatus = defaultThunkLoadingState;
    });
    builder.addCase(getSubscriptionPlan.fulfilled, (state, _action) => {
      state.fetchSubscriptionStatus = {
        ...defaultThunkSuccessState,
        statusMessage: 'success',
      };
      state.subscriptionPlan = _action.payload;
    });
    builder.addCase(getSubscriptionPlan.rejected, (state, action) => {
      state.fetchSubscriptionStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    builder.addCase(getAllRoles.pending, state => {
      state.fetchRolesStatus = defaultThunkLoadingState;
    });
    builder.addCase(getAllRoles.fulfilled, (state, _action) => {
      state.fetchRolesStatus = {
        ...defaultThunkSuccessState,
        statusMessage: 'success',
      };
      if (state.user) {
        state.user.organizationRoles = _action.payload;
      }
    });
    builder.addCase(getAllRoles.rejected, (state, action) => {
      state.fetchRolesStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    builder.addCase(getUserSubscription.pending, state => {
      state.fetchSubscriptionStatus = defaultThunkLoadingState;
    });
    builder.addCase(getUserSubscription.fulfilled, (state, _action) => {
      state.fetchSubscriptionStatus = {
        ...defaultThunkSuccessState,
        statusMessage: 'success',
      };
      if (state.user) {
        state.user.subscription = _action.payload;
        state.user.isSubscriptionActive = true;
      }
    });
    builder.addCase(getUserSubscription.rejected, (state, action) => {
      state.fetchSubscriptionStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(getUserIntegration.pending, state => {
      state.fetchSubscriptionStatus = defaultThunkLoadingState;
    });
    builder.addCase(getUserIntegration.fulfilled, (state, _action) => {
      state.fetchSubscriptionStatus = {
        ...defaultThunkSuccessState,
        statusMessage: 'success',
      };
      if (state.user) {
        state.user.userIntegrations = _action.payload;
      }
    });
    builder.addCase(getUserIntegration.rejected, (state, action) => {
      state.fetchSubscriptionStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(createUserSubscription.pending, state => {
      state.createSubscriptionStatus = defaultThunkLoadingState;
    });
    builder.addCase(createUserSubscription.fulfilled, (state, _action) => {
      state.createSubscriptionStatus = {
        ...defaultThunkSuccessState,
        statusMessage: 'success',
      };
      if (state.user) {
        state.user.subscription = _action.payload;
        if (_action.meta.arg.isTrail && state.user) {
          state.user.isSubscriptionActive = true;
        }
      }
    });
    builder.addCase(createUserSubscription.rejected, (state, action) => {
      state.createSubscriptionStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(updateUserSubscription.pending, state => {
      state.createSubscriptionStatus = defaultThunkLoadingState;
    });
    builder.addCase(updateUserSubscription.fulfilled, (state, _action) => {
      state.createSubscriptionStatus = {
        ...defaultThunkSuccessState,
        statusMessage: 'success',
      };
    });
    builder.addCase(updateUserSubscription.rejected, (state, action) => {
      state.createSubscriptionStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(cancelUserSubscription.pending, state => {
      state.fetchSubscriptionStatus = defaultThunkLoadingState;
    });
    builder.addCase(cancelUserSubscription.fulfilled, (state, _action) => {
      state.fetchSubscriptionStatus = {
        ...defaultThunkSuccessState,
        statusMessage: 'success',
      };
      if (state.user) {
        state.user.isSubscriptionActive = false;
        state.user.subscription = null;
        state.user.isTrailTaken = true;
      }
    });
    builder.addCase(cancelUserSubscription.rejected, (state, action) => {
      state.fetchSubscriptionStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    //Digital Cards
    builder.addCase(getDigitalCard.pending, state => {
      state.fetchDigitalCardStatus = defaultThunkLoadingState;
    });
    builder.addCase(getDigitalCard.fulfilled, (state, _action) => {
      state.fetchDigitalCardStatus = {
        ...defaultThunkSuccessState,
        statusMessage: 'success',
      };
      console.log('getDigitalCard', _action.payload);
      state.digitalCard = _action.payload;
    });
    builder.addCase(getDigitalCard.rejected, (state, action) => {
      state.fetchDigitalCardStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    builder.addCase(createDigitalCard.pending, state => {
      state.fetchDigitalCardStatus = defaultThunkLoadingState;
    });
    builder.addCase(createDigitalCard.fulfilled, (state, _action) => {
      state.fetchDigitalCardStatus = {
        ...defaultThunkSuccessState,
        statusMessage: 'success',
      };
      state.digitalCard = _action.payload;
    });
    builder.addCase(createDigitalCard.rejected, (state, action) => {
      state.fetchDigitalCardStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(updateDigitalCard.pending, state => {
      state.fetchDigitalCardStatus = defaultThunkLoadingState;
    });
    builder.addCase(updateDigitalCard.fulfilled, (state, _action) => {
      state.fetchDigitalCardStatus = {
        ...defaultThunkSuccessState,
        statusMessage: 'success',
      };
    });
    builder.addCase(updateDigitalCard.rejected, (state, action) => {
      state.fetchDigitalCardStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(getReferredUsers.pending, state => {
      state.fetchreferredUsersStatus = defaultThunkLoadingState;
    });
    builder.addCase(getReferredUsers.fulfilled, (state, _action) => {
      state.fetchreferredUsersStatus = {
        ...defaultThunkSuccessState,
        statusMessage: 'success',
      };
      state.referredUsers = _action.payload;
    });
    builder.addCase(getReferredUsers.rejected, (state, action) => {
      state.fetchreferredUsersStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
  },
});

export default userSlice.reducer;
export const {restoreUserStore} = userSlice.actions;
export const currentUserSelector: (state: RootState) => User | null = (
  state: RootState,
) => state.user.user || null;
export const getOrganisation: (state: RootState) => Organisation | null = (
  state: RootState,
) => state.user?.user?.organization || null;

export const selectAllUsers: (state: RootState) => Array<TeamMember> = (
  state: RootState,
) => state.user?.user?.organizationEmployee || [];
export const selectAllEmployees: (state: RootState) => Array<TeamMember> = (
  state: RootState,
) =>
  state.user?.user?.organizationEmployee?.filter(
    _user => state.user.user && _user._id !== state.user?.user._id,
  ) || [];
export const selectUserById: (
  state: RootState,
  userId: Nillable<string>,
) => Nillable<TeamMember | User> = (
  state: RootState,
  userId: Nillable<string>,
) =>
  state.user?.user?._id === userId
    ? state.user.user
    : state.user?.user?.organizationEmployee?.find(
        _user => _user._id === userId,
      );

export const selectAllTeams: (state: RootState) => Array<Team> = (
  state: RootState,
) => state.user?.user?.organizationTeams || [];

export const selectIntegrations: (state: RootState) => Array<Integration> = (
  state: RootState,
) => state.user?.user?.systemIntegration || [];
export const selectUserIntegrations: (
  state: RootState,
) => Array<UserIntegration> = (state: RootState) =>
  state.user?.user?.userIntegrations || [];
export const selectSelectableIntegrations: (state: RootState) => Array<any> = (
  state: RootState,
) =>
  state.user?.user?.systemIntegration?.map(_i => ({
    name: _i.name,
    value: _i._id,
  })) || [];

export const userPrefrenceSelector: (
  state: RootState,
) => Nillable<PrefrenceObject> = (state: RootState) =>
  state.user?.user ? state.user.user.userPreference : null;
export const selectPrefrence: (
  state: RootState,
  itemName: PrefrenceKeyEnum,
) => any = (state: RootState, itemName: PrefrenceKeyEnum) =>
  state.user?.user && state.user?.user?.userPreference
    ? state.user?.user?.userPreference[itemName]
    : [];
export const seletIntegration: (
  state: RootState,
  integrationId: string,
) => any = (state: RootState, integrationId: string) =>
  state.user?.user
    ? state.user?.user?.systemIntegration?.find(_i => _i._id === integrationId)
    : null;
export const selectUserIntegration: (
  state: RootState,
  integrationId: string,
) => Nillable<UserIntegration> = (state: RootState, integrationId: string) =>
  state.user?.user
    ? state.user?.user?.userIntegrations?.find(
        _i => _i.integrationId === integrationId,
      ) || null
    : null;
export const selectAllEmployeesByRole: (
  state: RootState,
  role_key: string,
) => Nillable<Array<TeamMember>> = (state: RootState, role_key: string) => {
  const role = state.user?.user?.organizationRoles?.find(
    _i => _i.name === role_key,
  );
  if (role) {
    return (
      state.user?.user?.organizationEmployee?.filter(_user =>
        typeof _user.role === 'string'
          ? _user.role === role._id
          : _user.role?._id === role._id,
      ) || []
    );
  } else {
    return [];
  }
};
export const selectUserIntegrationIds: (state: RootState) => Array<string> = (
  state: RootState,
) =>
  state.user?.user
    ? state.user?.user?.userIntegrations?.map(_i => _i.integrationId) || []
    : [];
export const seletTeamById: (
  state: RootState,
  teamId: string,
) => Nillable<Team> = (state: RootState, teamId: string) =>
  state.user?.user
    ? state.user?.user?.organizationTeams?.find(_i => _i._id === teamId)
    : null;

export const selectSubscriptionPlan: (
  state: RootState,
) => Array<Subscription> = (state: RootState) =>
  state.user.subscriptionPlan || [];
export const selectUserRoleName: (state: RootState) => string | null = (
  state: RootState,
) => state.user?.user?.role.name || null;

export const selectRoelByName: (state: RootState, itemName: string) => any = (
  state: RootState,
  itemName: string,
) => {
  const role = state.user?.user?.organizationRoles || [];
  return role.find(_u => _u.name === itemName);
};
export const selectRoelById: (
  state: RootState,
  itemId: string,
) => Nillable<Role> = (state: RootState, itemId: string) => {
  const role = state.user?.user?.organizationRoles || [];
  return role.find(_u => _u._id === itemId);
};
export const selectAllRoles: (state: RootState) => Array<Role> = (
  state: RootState,
) => {
  return state.user?.user?.organizationRoles || [];
};
export const selectRoleIdByName: (
  state: RootState,
  itemIds: Array<string>,
) => Array<any> = (state: RootState, itemIds: Array<string>) => {
  const roles = state.user?.user?.organizationRoles || [];
  return (
    roles.filter(_u => itemIds.includes(_u?.name || 'NA'))?.map(_i => _i._id) ||
    []
  );
};
export const selectUserByTeam: (
  state: RootState,
  teamId: Nillable<string>,
) => Array<TeamMember> = (state: RootState, teamId: Nillable<string>) => {
  if (teamId === 'organisation') {
    return (
      state.user?.user?.organizationEmployee?.filter(_user => !_user?.team) ||
      []
    );
  } else if (teamId && teamId !== '' && teamId.length) {
    return (
      state.user?.user?.organizationEmployee?.filter(
        _user => _user?.team === teamId,
      ) || []
    );
  } else {
    return state.user?.user?.organizationEmployee || [];
  }
};

export const selectSubcriptionStatus: (state: RootState) => boolean = (
  state: RootState,
) => {
  const roleName = state.user?.user?.role?.name || '';
  if (roleName === 'super_admin') {
    return state.user?.user?.isSubscriptionActive || false;
  } else {
    return true;
  }
};

export const selectPermissions: (state: RootState) => Array<string> = (
  state: RootState,
) =>
  state.user?.user && state.user?.user?.userPreference
    ? state.user?.user?.userPreference[PrefrenceKeyEnum.SCREEN_PERMISSION] || []
    : [];
export const selectDigitalCard: (state: RootState) => Nillable<Digitalcard> = (
  state: RootState,
) => state.user?.digitalCard;
export const selectReferredUsers: (state: RootState) => Array<Object> = (
  state: RootState,
) => state.user?.referredUsers;
