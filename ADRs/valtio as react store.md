There are couple of factors to be consider while choosing the right react store:

1. Needs to return persistance reference in the component. Since some of our effect(like whole Creator whic hspins up wasm and WebGPU) cannot be created and destoryed with each call of useEffect
2. No wrappers like mobx which hrequire each component to be wrapped in observer
3. No wrappers in the component tree like context API

So we option that seems matching all my needs is valtio
https://github.com/pmndrs/valtio
