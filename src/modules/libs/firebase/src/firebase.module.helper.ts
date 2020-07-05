import {Provider} from '@nestjs/common';

export class FirebaseModuleHelper {
    static createProviders(
        providers: Provider<any>[],
        value: any,
    ): Provider<any>[] {
        return providers.map(
            (ProviderService: any) => ({
                    provide: ProviderService,
                    useFactory: () => new ProviderService(value),
                }
            )
        );
    }
}