/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Config {
  androidPath?: string;
  fastlaneReleaseNoteLanguages?: string[];
  iosPath?: string;
  isFastlane?: boolean;
}

export interface Context {
  /** The previous release details. */
  lastRelease?: LastRelease;
  /** The shared logger instance of semantic release. */
  logger: {
    error: (message: string, ...vars: any[]) => void;
    log: (message: string, ...vars: any[]) => void;
  };
  /** The next release details. */
  nextRelease?: NextRelease;
  /** The semantic release configuration itself. */
  options?: GlobalConfig;
}

/**
 * The semantic release configuration itself.
 */
export interface GlobalConfig {
  /** The branch on which releases should happen. */
  branch: string;
  /** The full prepare step configuration. */
  prepare?: any;
  /** The Git repository URL, in any supported format. */
  repositoryUrl: string;
  /** The Git tag format used by semantic-release to identify releases. */
  tagFormat: string;
}

export interface LastRelease {
  /** The Git checksum of the last commit of the release. */
  gitHead: string;
  /** The Git tag of the release. */
  gitTag: string;
  /** The version name of the release */
  version: string;
}

export interface NextRelease extends LastRelease {
  /** The release notes of the next release. */
  notes: string;
}

/**
 * A method which is used by semantic releases as script execution.
 * This is loaded and injected by semantic itself.
 */
export type SemanticMethod = (config: Config, context: Context) => any;
