
import { useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTimer } from 'react-timer-hook';

import { formatEther } from 'viem';
import {
  Address,
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { AppContext } from '../context/AppContext'
import { contracts } from '../contracts'

import { useLocalStorage } from '../hooks/useLocalStorage'
import imgPaths from '../assets/images/paths'
import { Weapons, weapons } from '../models/weaponsModel';
